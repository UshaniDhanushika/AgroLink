package com.agrolink.identity.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Read-only user profile DTO returned by GET /auth/me and GET /api/v1/users/me.
 * Never exposes passwordHash, tokens, or sensitive internals.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private String id;
    private String email;
    private String fullName;
    private String phone;
    private String organizationName;
    private String role;
    private String status;
    private boolean emailVerified;
    private Instant createdAt;
    private Instant updatedAt;
}
