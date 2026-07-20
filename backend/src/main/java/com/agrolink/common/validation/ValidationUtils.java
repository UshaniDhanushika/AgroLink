package com.agrolink.common.validation;

import com.agrolink.common.exception.BadRequestException;
import java.util.Collection;
import java.util.Objects;
import java.util.regex.Pattern;
import org.springframework.util.StringUtils;

/**
 * Shared validation helpers for service-layer semantic checks.
 */
public final class ValidationUtils {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$", Pattern.CASE_INSENSITIVE);

    private static final Pattern E164_PHONE_PATTERN =
            Pattern.compile("^\\+[1-9]\\d{7,14}$");

    private ValidationUtils() {
    }

    public static void requireNonBlank(String value, String fieldName) {
        if (!StringUtils.hasText(value)) {
            throw new BadRequestException(fieldName + " must not be blank");
        }
    }

    public static void requireNonNull(Object value, String fieldName) {
        if (value == null) {
            throw new BadRequestException(fieldName + " must not be null");
        }
    }

    public static void requireNotEmpty(Collection<?> value, String fieldName) {
        if (value == null || value.isEmpty()) {
            throw new BadRequestException(fieldName + " must not be empty");
        }
    }

    public static void requireTrue(boolean condition, String message) {
        if (!condition) {
            throw new BadRequestException(message);
        }
    }

    public static void requireEmail(String email) {
        requireNonBlank(email, "email");
        if (!EMAIL_PATTERN.matcher(email.trim()).matches()) {
            throw new BadRequestException("email format is invalid");
        }
    }

    public static void requirePhoneE164(String phone) {
        requireNonBlank(phone, "phone");
        if (!E164_PHONE_PATTERN.matcher(phone.trim()).matches()) {
            throw new BadRequestException("phone must be in E.164 format");
        }
    }

    public static void requirePositive(Number number, String fieldName) {
        requireNonNull(number, fieldName);
        if (number.doubleValue() <= 0) {
            throw new BadRequestException(fieldName + " must be positive");
        }
    }

    public static void requireMaxLength(String value, int max, String fieldName) {
        if (value != null && value.length() > max) {
            throw new BadRequestException(fieldName + " must be at most " + max + " characters");
        }
    }

    public static boolean equalsIgnoreCase(String left, String right) {
        return Objects.equals(
                left == null ? null : left.toLowerCase(),
                right == null ? null : right.toLowerCase());
    }
}
