package com.agrolink.identity.application.dto;

import com.agrolink.identity.domain.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 80, message = "Full name must be between 2 and 80 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @Size(max = 20, message = "Phone number is too long")
    @Pattern(regexp = "^[+]?[\\d\\s\\-().]{7,20}$|^$", message = "Phone number format is invalid")
    private String phone;

    @Size(max = 100, message = "Organisation name is too long")
    private String organizationName;

    /**
     * Min 10 chars; must contain at least one uppercase letter and one digit.
     * See security doc §14.4 — Password policy.
     */
    @NotBlank(message = "Password is required")
    @Size(min = 10, message = "Password must be at least 10 characters (security policy)")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*\\d).+$",
        message = "Password must contain at least one uppercase letter and one digit"
    )
    private String password;

    @NotNull(message = "Role is required")
    private Role role;
}
