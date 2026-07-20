package com.agrolink.identity.infrastructure;

import com.agrolink.common.persistence.BaseMongoRepository;
import com.agrolink.identity.domain.User;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends BaseMongoRepository<User> {
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationToken(String token);
    Optional<User> findByResetPasswordToken(String token);
    boolean existsByEmail(String email);
}
