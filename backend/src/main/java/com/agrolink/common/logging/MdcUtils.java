package com.agrolink.common.logging;

import org.slf4j.MDC;

public final class MdcUtils {

    private MdcUtils() {
    }

    public static void setUserId(String userId) {
        if (userId != null) {
            MDC.put("userId", userId);
        }
    }

    public static void clearUserId() {
        MDC.remove("userId");
    }
}
