package com.agrolink.common.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.util.StringUtils;

public final class HttpRequestUtils {

    private HttpRequestUtils() {
    }

    public static String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(forwarded)) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    public static String bearerToken(HttpServletRequest request, String headerName, String prefix) {
        String header = request.getHeader(headerName);
        if (!StringUtils.hasText(header) || !header.startsWith(prefix)) {
            return null;
        }
        return header.substring(prefix.length()).trim();
    }
}
