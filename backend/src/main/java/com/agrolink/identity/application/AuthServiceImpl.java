package com.agrolink.identity.application;

import com.agrolink.common.exception.BusinessException;
import com.agrolink.common.exception.ErrorCode;
import com.agrolink.identity.application.dto.AuthResponse;
import com.agrolink.identity.application.dto.ForgotPasswordRequest;
import com.agrolink.identity.application.dto.LoginRequest;
import com.agrolink.identity.application.dto.LogoutRequest;
import com.agrolink.identity.application.dto.RefreshTokenRequest;
import com.agrolink.identity.application.dto.RegisterRequest;
import com.agrolink.identity.application.dto.ResetPasswordRequest;
import com.agrolink.identity.application.dto.UserDto;
import com.agrolink.identity.domain.RefreshToken;
import com.agrolink.identity.domain.User;
import com.agrolink.identity.domain.UserStatus;
import com.agrolink.identity.email.EmailService;
import com.agrolink.identity.infrastructure.RefreshTokenRepository;
import com.agrolink.identity.infrastructure.UserRepository;
import com.agrolink.security.UserPrincipal;
import com.agrolink.security.jwt.JwtService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository            userRepository;
    private final RefreshTokenRepository    refreshTokenRepository;
    private final PasswordEncoder           passwordEncoder;
    private final JwtService                jwtService;
    private final TokenService              tokenService;
    private final EmailService              emailService;

    // ── Register ──────────────────────────────────────────────
    @Override
    public void register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase().strip();
        if (userRepository.existsByEmail(email)) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Email already in use");
        }

        String verificationToken = UUID.randomUUID().toString();

        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .organizationName(request.getOrganizationName())
                .role(request.getRole())
                .status(UserStatus.ACTIVE)
                .emailVerified(false)
                .verificationToken(verificationToken)
                .build();

        userRepository.save(user);
        log.info("User registered: email={}, role={}", email, request.getRole());
        emailService.sendVerificationEmail(email, verificationToken);
    }

    // ── Login ─────────────────────────────────────────────────
    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().strip();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "Invalid credentials");
        }

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Account suspended");
        }
        if (user.getStatus() == UserStatus.DELETED) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "Account not found");
        }
        if (!user.isEmailVerified()) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "Email not verified. Check your inbox.");
        }

        return issueTokenPair(user);
    }

    // ── Refresh ───────────────────────────────────────────────
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

                    // Rotate: revoke old, issue new
                    tokenService.deleteByUserId(user.getId());
                    return issueTokenPair(user);
                })
                .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED, "Refresh token is invalid or expired"));
    }

    // ── Logout ───────────────────────────────────────────────
    @Override
    public void logout(LogoutRequest request) {
        refreshTokenRepository.findByToken(request.getRefreshToken())
                .ifPresent(rt -> {
                    tokenService.deleteByUserId(rt.getUserId());
                    log.info("User logged out, refresh tokens revoked for userId={}", rt.getUserId());
                });
    }

    // ── Email verification ───────────────────────────────────
    @Override
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new BusinessException(ErrorCode.BAD_REQUEST, "Invalid or expired verification token"));

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);
        log.info("Email verified for userId={}", user.getId());
    }

    // ── Forgot / Reset password ──────────────────────────────
    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        // Anti-enumeration: always succeed regardless of whether user exists
        userRepository.findByEmail(request.getEmail().toLowerCase()).ifPresent(user -> {
            String resetToken = UUID.randomUUID().toString();
            user.setResetPasswordToken(resetToken);
            userRepository.save(user);
            emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
        });
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new BusinessException(ErrorCode.BAD_REQUEST, "Invalid or expired reset token"));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setResetPasswordToken(null);
        userRepository.save(user);

        // Revoke all refresh tokens — force re-login after password change
        tokenService.deleteByUserId(user.getId());
        log.info("Password reset for userId={}", user.getId());
    }

    // ── Current user ─────────────────────────────────────────
    @Override
    public UserDto getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED, "User not found"));
        return toDto(user);
    }

    // ── Private helpers ──────────────────────────────────────
    private AuthResponse issueTokenPair(User user) {
        UserPrincipal principal = UserPrincipal.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .active(user.isActive())
                .build();

        String accessToken  = jwtService.generateAccessToken(principal);
        long   expiresIn    = jwtService.getAccessTokenExpirationMs() / 1000L;

        tokenService.deleteByUserId(user.getId());
        RefreshToken refreshToken = tokenService.createRefreshToken(user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .expiresIn(expiresIn)
                .refreshToken(refreshToken.getToken())
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    private UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .organizationName(user.getOrganizationName())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .status(user.getStatus() != null ? user.getStatus().name() : null)
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
