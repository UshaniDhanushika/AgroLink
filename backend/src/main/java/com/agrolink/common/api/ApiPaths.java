package com.agrolink.common.api;

/**
 * Stable API path constants for the foundation layer.
 * Business modules will add their own path constants later.
 */
public final class ApiPaths {

    public static final String API_V1 = "/api/v1";
    public static final String HEALTH = API_V1 + "/health";

    private ApiPaths() {
    }
}
