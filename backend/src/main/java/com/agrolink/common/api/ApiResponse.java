package com.agrolink.common.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Generic API response envelope used by all controllers.
 *
 * @param <T> payload type
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private String correlationId;
    private Instant timestamp;
    private List<FieldErrorDetail> errors;

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message("OK")
                .data(data)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> success(String message, T data, String correlationId) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .correlationId(correlationId)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> failure(String message, String correlationId) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .correlationId(correlationId)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> failure(
            String message, String correlationId, List<FieldErrorDetail> errors) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .correlationId(correlationId)
                .errors(errors)
                .timestamp(Instant.now())
                .build();
    }
}
