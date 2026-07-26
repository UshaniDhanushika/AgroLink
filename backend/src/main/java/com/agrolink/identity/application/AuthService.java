package com.agrolink.identity.application;

import com.agrolink.identity.application.dto.AuthResponse;
import com.agrolink.identity.application.dto.ForgotPasswordRequest;
import com.agrolink.identity.application.dto.LoginRequest;
import com.agrolink.identity.application.dto.LogoutRequest;
import com.agrolink.identity.application.dto.RefreshTokenRequest;
import com.agrolink.identity.application.dto.RegisterRequest;
import com.agrolink.identity.application.dto.ResetPasswordRequest;
import com.agrolink.identity.application.dto.UserDto;

public interface AuthService {
    void register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
    void logout(LogoutRequest request);
    void verifyEmail(String token);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
    UserDto getCurrentUser(String userId);
}
