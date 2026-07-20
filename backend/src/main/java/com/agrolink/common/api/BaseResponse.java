package com.agrolink.common.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Lightweight metadata envelope shared by success and error payloads.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BaseResponse {

    private boolean success;
    private String message;
    private String correlationId;
    private Instant timestamp;

    public static BaseResponse ok(String message, String correlationId) {
        return BaseResponse.builder()
                .success(true)
                .message(message)
                .correlationId(correlationId)
                .timestamp(Instant.now())
                .build();
    }

    public static BaseResponse fail(String message, String correlationId) {
        return BaseResponse.builder()
                .success(false)
                .message(message)
                .correlationId(correlationId)
                .timestamp(Instant.now())
                .build();
    }
}
