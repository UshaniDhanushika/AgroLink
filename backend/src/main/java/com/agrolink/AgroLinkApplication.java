package com.agrolink;

import com.agrolink.config.AgroLinkProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
@EnableConfigurationProperties(AgroLinkProperties.class)
public class AgroLinkApplication {

    public static void main(String[] args) {
        SpringApplication.run(AgroLinkApplication.class, args);
    }
}
