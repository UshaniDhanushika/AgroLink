package com.agrolink.identity.domain;

/**
 * Lifecycle status of a user account.
 * Doc ref: §11.4 users collection — User.status enum
 */
public enum UserStatus {
    ACTIVE,
    SUSPENDED,
    DELETED
}
