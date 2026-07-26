package com.agrolink.identity.application.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request body for PUT /api/v1/users/me — partial update of the authenticated user's profile.
 * Only fields provided (non-null) are applied.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @Size(min = 2, max = 80, message = "Full name must be between 2 and 80 characters")
    private String fullName;

    @Size(max = 20, message = "Phone number is too long")
    @Pattern(regexp = "^[+]?[\\d\\s\\-().]{7,20}$|^$", message = "Phone number format is invalid")
    private String phone;

    @Size(max = 100, message = "Organisation name is too long")
    private String organizationName;
}
