package com.agrolink.config;

import java.util.Arrays;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.CollectionUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
public class CorsConfig {

    private final AgroLinkProperties properties;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        List<String> origins = properties.getCors().getAllowedOrigins();
        if (CollectionUtils.isEmpty(origins)) {
            configuration.setAllowedOriginPatterns(List.of("*"));
        } else {
            configuration.setAllowedOrigins(origins);
        }

        List<String> methods = properties.getCors().getAllowedMethods();
        configuration.setAllowedMethods(CollectionUtils.isEmpty(methods)
                ? Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                : methods);

        List<String> headers = properties.getCors().getAllowedHeaders();
        if (CollectionUtils.isEmpty(headers) || headers.contains("*")) {
            configuration.addAllowedHeader("*");
        } else {
            configuration.setAllowedHeaders(headers);
        }

        List<String> exposed = properties.getCors().getExposedHeaders();
        if (!CollectionUtils.isEmpty(exposed)) {
            configuration.setExposedHeaders(exposed);
        }

        configuration.setAllowCredentials(properties.getCors().isAllowCredentials());
        configuration.setMaxAge(properties.getCors().getMaxAge());

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
