package org.danielbreves.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.danielbreves.backend.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    private static final String TOKEN_VERSION_CLAIM = "tokenVersion";

    public String generateToken(User user) {
        return Jwts.builder()
                .subject(user.getEmail())
                .claim(TOKEN_VERSION_CLAIM, normalizeTokenVersion(user))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractEmail(String token) {
        Claims claims = extractClaims(token);

        return claims.getSubject();
    }

    public Long extractTokenVersion(String token) {
        Claims claims = extractClaims(token);
        Object tokenVersion = claims.get(TOKEN_VERSION_CLAIM);

        if (tokenVersion instanceof Number number) {
            return number.longValue();
        }

        return null;
    }

    public boolean isTokenValid(String token, User user) {
        try {
            String email = extractEmail(token);
            Long tokenVersion = extractTokenVersion(token);

            return email.equals(user.getEmail()) &&
                    normalizeTokenVersion(user).equals(tokenVersion);
        } catch (Exception e) {
            return false;
        }
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Long normalizeTokenVersion(User user) {
        return user.getTokenVersion() == null ? 0L : user.getTokenVersion();
    }
}
