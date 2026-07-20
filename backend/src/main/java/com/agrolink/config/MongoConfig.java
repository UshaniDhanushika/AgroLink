package com.agrolink.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.MongoTransactionManager;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * MongoDB foundation configuration.
 * Connection settings come from {@code spring.data.mongodb.uri}.
 * Auditing is enabled on {@link com.agrolink.AgroLinkApplication}.
 */
@Slf4j
@Configuration
@EnableMongoRepositories(basePackages = "com.agrolink")
public class MongoConfig {

    /**
     * Enables multi-document transactions when running against a replica set.
     */
    @Bean
    @ConditionalOnBean(MongoDatabaseFactory.class)
    public MongoTransactionManager transactionManager(MongoDatabaseFactory databaseFactory) {
        return new MongoTransactionManager(databaseFactory);
    }

    @Bean
    @ConditionalOnBean(MongoDatabaseFactory.class)
    ApplicationRunner mongoStartupLogger(MongoDatabaseFactory databaseFactory) {
        return args -> log.info("MongoDB database ready: {}", databaseFactory.getMongoDatabase().getName());
    }
}
