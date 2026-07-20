package com.agrolink.system;

import com.agrolink.common.api.ApiPaths;
import com.agrolink.common.api.ApiResponse;
import com.agrolink.common.logging.CorrelationIdFilter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Instant;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Foundation health endpoint (not a business module).
 */
@RestController
@RequestMapping(ApiPaths.HEALTH)
@RequiredArgsConstructor
@Tag(name = "System", description = "Foundation health and diagnostics")
public class HealthController {

    private final Environment environment;

    @GetMapping
    @Operation(summary = "Application health check")
    public ResponseEntity<ApiResponse<Map<String, Object>>> health() {
        Map<String, Object> payload = Map.of(
                "status", "UP",
                "service", "agrolink-api",
                "timestamp", Instant.now().toString(),
                "profiles", environment.getActiveProfiles()
        );

        return ResponseEntity.ok(ApiResponse.success(
                "AgroLink API is healthy",
                payload,
                MDC.get(CorrelationIdFilter.MDC_KEY)));
    }
}
