package com.agrolink.identity.application;

import com.agrolink.common.exception.BusinessException;
import com.agrolink.common.exception.ErrorCode;
import com.agrolink.identity.application.dto.AuthResponse;
import com.agrolink.identity.application.dto.ForgotPasswordRequest;
import com.agrolink.identity.application.dto.LoginRequest;
import com.agrolink.identity.application.dto.RefreshTokenRequest;
import com.agrolink.identity.application.dto.RegisterRequest;
import com.agrolink.identity.application.dto.ResetPasswordRequest;
import com.agrolink.identity.domain.RefreshToken;
import com.agrolink.identity.domain.User;
import com.agrolink.identity.email.EmailService;
import com.agrolink.identity.infrastructure.RefreshTokenRepository;
import com.agrolink.identity.infrastructure.UserRepository;
import com.agrolink.security.UserPrincipal;
import com.agrolink.security.jwt.JwtService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenService tokenService;
    private final EmailService emailService;

    @Override
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Email already in use");
        }

        String verificationToken = UUID.randomUUID().toString();

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .active(true) // Consider whether active should be false until verified
                .emailVerified(false)
                .verificationToken(verificationToken)
                .build();

        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), verificationToken);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "Invalid email or password");
        }
        
        if (!user.isActive()) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "Account is disabled");
        }
        
        if (!user.isEmailVerified()) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "Email not verified");
        }

        UserPrincipal principal = UserPrincipal.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .active(user.isActive())
                .build();

        String accessToken = jwtService.generateAccessToken(principal);
        
        // Remove existing refresh token if necessary or just issue a new one
        tokenService.deleteByUserId(user.getId());
        RefreshToken refreshToken = tokenService.createRefreshToken(user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        return refreshTokenRepository.findByToken(request.getRefreshToken())
                .map(tokenService::verifyExpiration)
                .map(RefreshToken::getUserId)
                .map(userId -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED, "User not found"));
                    
                    if (!user.isActive()) {
                        throw new BusinessException(ErrorCode.UNAUTHORIZED, "Account is disabled");
                    }

                    UserPrincipal principal = UserPrincipal.builder()
                            .id(user.getId())
                            .email(user.getEmail())
                            .role(user.getRole().name())
                            .active(user.isActive())
                            .build();

                    String accessToken = jwtService.generateAccessToken(principal);
                    
                    // Rotate refresh token (optional but recommended)
                    tokenService.deleteByUserId(user.getId());
                    RefreshToken newRefreshToken = tokenService.createRefreshToken(user.getId());

                    return AuthResponse.builder()
                            .accessToken(accessToken)
                            .refreshToken(newRefreshToken.getToken())
                            .id(user.getId())
                            .email(user.getEmail())
                            .role(user.getRole().name())
                            .build();
                })
                .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED, "Refresh token is not in database!"));
    }

    @Override
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new BusinessException(ErrorCode.BAD_REQUEST, "Invalid verification token"));

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            String resetToken = UUID.randomUUID().toString();
            user.setResetPasswordToken(resetToken);
            userRepository.save(user);
            emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
        });
        // We don't throw an error if the user is not found to prevent email enumeration
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new BusinessException(ErrorCode.BAD_REQUEST, "Invalid reset token"));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setResetPasswordToken(null);
        userRepository.save(user);
    }
}
