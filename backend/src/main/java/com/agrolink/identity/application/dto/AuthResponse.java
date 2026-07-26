package com.agrolink.identity.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Login/refresh response — §13.3 Auth APIs login response shape.
 * { accessToken, expiresIn, tokenType, refreshToken?, user }
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;

    @Builder.Default
    private String tokenType = "Bearer";

    /** Remaining lifetime of the access token in seconds. */
    private long expiresIn;

    private String refreshToken;

    // ── User summary ─────────────────────────────────────────
    private String id;
    private String email;
    private String fullName;
    private String role;
}
