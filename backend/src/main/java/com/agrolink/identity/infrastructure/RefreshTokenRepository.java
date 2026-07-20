package com.agrolink.identity.infrastructure;

import com.agrolink.common.persistence.BaseMongoRepository;
import com.agrolink.identity.domain.RefreshToken;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRepository extends BaseMongoRepository<RefreshToken> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUserId(String userId);
}
