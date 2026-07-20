package com.agrolink.identity.api;

import com.agrolink.identity.application.AuthService;
import com.agrolink.identity.application.dto.AuthResponse;
import com.agrolink.identity.application.dto.ForgotPasswordRequest;
import com.agrolink.identity.application.dto.LoginRequest;
import com.agrolink.identity.application.dto.RefreshTokenRequest;
import com.agrolink.identity.application.dto.RegisterRequest;
import com.agrolink.identity.application.dto.ResetPasswordRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${agrolink.api.base-path:/api/v1}/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication and authorization APIs")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Register new user", description = "Creates a new user account and sends verification email")
    @ApiResponse(responseCode = "201", description = "User successfully created")
    public void register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user", description = "Login with email and password to receive JWT and refresh tokens")
    @ApiResponse(responseCode = "200", description = "Successfully authenticated")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", description = "Obtain a new access token using a valid refresh token")
    @ApiResponse(responseCode = "200", description = "Successfully refreshed token")
    public AuthResponse refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return authService.refreshToken(request);
    }

    @GetMapping("/verify-email")
    @Operation(summary = "Verify email", description = "Verify user email using the token sent to their inbox")
    @ApiResponse(responseCode = "200", description = "Email successfully verified")
    public void verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Forgot password", description = "Send a password reset email if the user exists")
    @ApiResponse(responseCode = "200", description = "Reset email sent")
    public void forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password", description = "Reset password using the token sent to email")
    @ApiResponse(responseCode = "200", description = "Password successfully reset")
    public void resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
    }
}
