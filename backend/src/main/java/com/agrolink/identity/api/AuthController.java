package com.agrolink.identity.api;

import com.agrolink.identity.application.AuthService;
import com.agrolink.identity.application.dto.AuthResponse;
import com.agrolink.identity.application.dto.ForgotPasswordRequest;
import com.agrolink.identity.application.dto.LoginRequest;
import com.agrolink.identity.application.dto.LogoutRequest;
import com.agrolink.identity.application.dto.RefreshTokenRequest;
import com.agrolink.identity.application.dto.RegisterRequest;
import com.agrolink.identity.application.dto.ResetPasswordRequest;
import com.agrolink.identity.application.dto.UserDto;
import com.agrolink.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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

/**
 * Authentication & identity endpoints.
 *
 * Public:     POST /register, POST /login, POST /refresh,
 *             GET  /verify-email, POST /forgot-password, POST /reset-password
 * Protected:  POST /logout, GET /me
 *
 * See doc §13.3 Auth APIs and §15.3–15.6 JWT sequences.
 */
@RestController
@RequestMapping("${agrolink.api.base-path:/api/v1}/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication and authorization endpoints")
public class AuthController {

    private final AuthService authService;

    // ── Register ─────────────────────────────────────────────
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
        summary = "Register a new user",
        description = "Creates a new BUYER, SELLER, or LOGISTICS account and sends an email verification link. "
                    + "Password must be ≥10 chars and contain at least one uppercase letter and one digit."
    )
    @ApiResponse(responseCode = "201", description = "Account created; verification email sent")
    @ApiResponse(responseCode = "400", description = "Validation error or email already in use")
    public void register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
    }

    // ── Login ────────────────────────────────────────────────
    @PostMapping("/login")
    @Operation(
        summary = "Authenticate user",
        description = "Exchange email + password for a short-lived JWT access token and a refresh token. "
                    + "See §15.3 Login Sequence."
    )
    @ApiResponse(responseCode = "200", description = "Tokens issued successfully")
    @ApiResponse(responseCode = "401", description = "Invalid credentials / email not verified")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    // ── Refresh token ────────────────────────────────────────
    @PostMapping("/refresh")
    @Operation(
        summary = "Rotate access token",
        description = "Present a valid refresh token to obtain a new access token and a rotated refresh token. "
                    + "The old refresh token is invalidated (rotation). See §15.5."
    )
    @ApiResponse(responseCode = "200", description = "New token pair issued")
    @ApiResponse(responseCode = "401", description = "Refresh token invalid or expired")
    public AuthResponse refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return authService.refreshToken(request);
    }

    // ── Logout ───────────────────────────────────────────────
    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
        summary = "Logout",
        description = "Revoke the provided refresh token. The access token expires naturally. See §15.6."
    )
    @ApiResponse(responseCode = "204", description = "Logged out; refresh token revoked")
    public void logout(@Valid @RequestBody LogoutRequest request) {
        authService.logout(request);
    }

    // ── Current user ─────────────────────────────────────────
    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
        summary = "Get current user",
        description = "Returns the authenticated user's profile. Requires a valid Bearer access token."
    )
    @ApiResponse(responseCode = "200", description = "Current user profile")
    @ApiResponse(responseCode = "401", description = "Not authenticated")
    public UserDto me() {
        String userId = SecurityUtils.requireCurrentUserId();
        return authService.getCurrentUser(userId);
    }

    // ── Email verification ───────────────────────────────────
    @GetMapping("/verify-email")
    @Operation(
        summary = "Verify email",
        description = "Confirms email ownership via the token sent in the verification email."
    )
    @ApiResponse(responseCode = "200", description = "Email verified")
    @ApiResponse(responseCode = "400", description = "Token invalid or expired")
    public void verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
    }

    // ── Forgot password ──────────────────────────────────────
    @PostMapping("/forgot-password")
    @Operation(
        summary = "Request password reset",
        description = "Sends a password-reset link if the email exists. Always returns 200 to prevent "
                    + "email enumeration (anti-enumeration design). See §14.3 Threat Model."
    )
    @ApiResponse(responseCode = "200", description = "Reset email dispatched (if account exists)")
    public void forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
    }

    // ── Reset password ───────────────────────────────────────
    @PostMapping("/reset-password")
    @Operation(
        summary = "Reset password",
        description = "Sets a new password using the one-time token from the reset email. "
                    + "Invalidates all existing refresh tokens for security."
    )
    @ApiResponse(responseCode = "200", description = "Password updated")
    @ApiResponse(responseCode = "400", description = "Token invalid or expired")
    public void resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
    }
}
