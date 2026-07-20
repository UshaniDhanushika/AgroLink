package com.agrolink.config;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "agrolink")
public class AgroLinkProperties {

    private final Cors cors = new Cors();
    private final Security security = new Security();
    private final Api api = new Api();

    @Getter
    @Setter
    public static class Cors {
        private List<String> allowedOrigins = new ArrayList<>();
        private List<String> allowedMethods = new ArrayList<>();
        private List<String> allowedHeaders = new ArrayList<>();
        private List<String> exposedHeaders = new ArrayList<>();
        private boolean allowCredentials = true;
        private long maxAge = 3600;
    }

    @Getter
    @Setter
    public static class Security {
        private final Jwt jwt = new Jwt();

        @Getter
        @Setter
        public static class Jwt {
            private String secret;
            private long accessTokenExpirationMs = 900_000L;
            private long refreshTokenExpirationMs = 604_800_000L; // 7 days
            private String issuer = "agrolink-api";
            private String header = "Authorization";
            private String prefix = "Bearer ";
        }
    }

    @Getter
    @Setter
    public static class Api {
        private String basePath = "/api/v1";
    }
}
