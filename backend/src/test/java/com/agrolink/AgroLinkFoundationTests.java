package com.agrolink;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.agrolink.common.api.ApiResponse;
import com.agrolink.common.validation.ValidationUtils;
import org.junit.jupiter.api.Test;

/**
 * Lightweight foundation tests that do not require a running MongoDB instance.
 */
class AgroLinkFoundationTests {

    @Test
    void apiResponseSuccessFactoryWorks() {
        ApiResponse<String> response = ApiResponse.success("pong");
        assertNotNull(response);
        assertNotNull(response.getTimestamp());
    }

    @Test
    void validationUtilsRejectsBlank() {
        try {
            ValidationUtils.requireNonBlank(" ", "name");
            throw new AssertionError("Expected BadRequestException");
        } catch (RuntimeException ex) {
            assertNotNull(ex.getMessage());
        }
    }
}
