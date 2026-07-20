package com.agrolink.common.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * RFC 7807-inspired problem details payload for API errors.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProblemDetails {

    private String type;
    private String title;
    private int status;
    private String detail;
    private String instance;
    private String code;
    private String correlationId;
    private Instant timestamp;
    private List<FieldErrorDetail> errors;
    private Map<String, Object> extensions;
}
