package com.agrolink.common.util;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

public final class DateTimeUtils {

    public static final DateTimeFormatter ISO_INSTANT = DateTimeFormatter.ISO_INSTANT;

    private DateTimeUtils() {
    }

    public static Instant nowUtc() {
        return Instant.now();
    }

    public static String formatIso(Instant instant) {
        if (instant == null) {
            return null;
        }
        return ISO_INSTANT.format(instant.atOffset(ZoneOffset.UTC));
    }
}
