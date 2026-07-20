package com.agrolink.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static Authentication authentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public static UserPrincipal currentUser() {
        Authentication authentication = authentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            return null;
        }
        return principal;
    }

    public static String currentUserId() {
        UserPrincipal principal = currentUser();
        return principal == null ? null : principal.getId();
    }

    public static String currentRole() {
        UserPrincipal principal = currentUser();
        return principal == null ? null : principal.getRole();
    }

    public static boolean hasRole(String role) {
        UserPrincipal principal = currentUser();
        return principal != null && role != null && role.equalsIgnoreCase(principal.getRole());
    }
}
