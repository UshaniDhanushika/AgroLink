package com.agrolink.identity.domain;

import com.agrolink.common.persistence.BaseDocument;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * User aggregate — identity, credentials, role, lifecycle status.
 * See doc §11.4 collections — users.
 *
 * Extends BaseDocument for audit fields (createdAt, updatedAt, createdBy, etc.).
 * BaseDocument no longer carries a generic String status field, so User.status
 * (UserStatus enum) has no return-type clash.
 */
@Document(collection = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@CompoundIndexes({
    @CompoundIndex(name = "role_status_idx", def = "{'role': 1, 'status': 1}")
})
public class User extends BaseDocument {

    // ── Credentials & Identity ────────────────────────────────

    @Indexed(unique = true)
    private String email;

    private String passwordHash;

    private String fullName;

    private String phone;

    private String organizationName;

    // ── Role & Status ─────────────────────────────────────────

    private Role role;

    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

    // ── Email verification ────────────────────────────────────

    @Builder.Default
    private boolean emailVerified = false;

    private String verificationToken;

    private String resetPasswordToken;

    // ── Optional profile data ─────────────────────────────────

    private Address address;

    private SellerProfile sellerProfile;

    private LogisticsProfile logisticsProfile;

    // ── Convenience helpers ────────────────────────────────────

    /** Returns true only when the account status is ACTIVE. */
    public boolean isActive() {
        return status == UserStatus.ACTIVE;
    }

    // ── Nested value objects ──────────────────────────────────

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Address {
        private String line;
        private String city;
        private String state;
        private String postalCode;
        private String country;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SellerProfile {
        private Double farmSizeHectares;
        private List<String> crops;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LogisticsProfile {
        private Integer fleetSize;
        private List<String> vehicleTypes;
    }
}
