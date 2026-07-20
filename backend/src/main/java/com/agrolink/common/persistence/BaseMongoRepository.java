package com.agrolink.common.persistence;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * Marker for module repositories. Soft-delete helpers will be added with business modules.
 *
 * @param <T> document type
 */
@NoRepositoryBean
public interface BaseMongoRepository<T extends BaseDocument> extends MongoRepository<T, String> {
}
