package com.agrolink.identity.application;

import com.agrolink.common.exception.BusinessException;
import com.agrolink.common.exception.ErrorCode;
import com.agrolink.config.AgroLinkProperties;
import com.agrolink.identity.domain.RefreshToken;
import com.agrolink.identity.infrastructure.RefreshTokenRepository;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final AgroLinkProperties properties;

    @Override
    public RefreshToken createRefreshToken(String userId) {
        RefreshToken refreshToken = RefreshToken.builder()
                .userId(userId)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(properties.getSecurity().getJwt().getRefreshTokenExpirationMs()))
                .build();
        
        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Override
    public void deleteByUserId(String userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }
}
