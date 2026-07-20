package com.agrolink.identity.application;

import com.agrolink.identity.domain.RefreshToken;

public interface TokenService {
    RefreshToken createRefreshToken(String userId);
    RefreshToken verifyExpiration(RefreshToken token);
    void deleteByUserId(String userId);
}
