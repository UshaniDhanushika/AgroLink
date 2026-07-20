package com.agrolink.security.jwt;

import com.agrolink.config.AgroLinkProperties;
import com.agrolink.security.UserPrincipal;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtService {

    public static final String CLAIM_ROLE = "role";
    public static final String CLAIM_EMAIL = "email";

    private final AgroLinkProperties properties;

    public String generateAccessToken(UserPrincipal principal) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + properties.getSecurity().getJwt().getAccessTokenExpirationMs());

        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .issuer(properties.getSecurity().getJwt().getIssuer())
                .subject(principal.getId())
                .claim(CLAIM_EMAIL, principal.getEmail())
                .claim(CLAIM_ROLE, principal.getRole())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey())
                .compact();
    }

    public boolean isValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (ExpiredJwtException ex) {
            log.debug("JWT expired: {}", ex.getMessage());
        } catch (UnsupportedJwtException | MalformedJwtException | SecurityException | IllegalArgumentException ex) {
            log.debug("JWT invalid: {}", ex.getMessage());
        }
        return false;
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey())
                .requireIssuer(properties.getSecurity().getJwt().getIssuer())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public UserPrincipal toPrincipal(Claims claims) {
        return UserPrincipal.builder()
                .id(claims.getSubject())
                .email(claims.get(CLAIM_EMAIL, String.class))
                .role(claims.get(CLAIM_ROLE, String.class))
                .active(true)
                .build();
    }

    public long getAccessTokenExpirationMs() {
        return properties.getSecurity().getJwt().getAccessTokenExpirationMs();
    }

    private SecretKey signingKey() {
        String secret = properties.getSecurity().getJwt().getSecret();
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(secret);
        } catch (IllegalArgumentException ex) {
            keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
