package org.danielbreves.backend.service;

import org.danielbreves.backend.exception.RateLimitExceededException;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Locale;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private final ConcurrentHashMap<String, RateLimitBucket> buckets =
            new ConcurrentHashMap<>();

    public void check(
            String namespace,
            String identifier,
            int maxAttempts,
            Duration window
    ) {
        String key = buildKey(namespace, identifier);
        Instant now = Instant.now();

        buckets.compute(key, (ignoredKey, currentBucket) -> {
            if (
                    currentBucket == null ||
                    !currentBucket.resetAt().isAfter(now)
            ) {
                return new RateLimitBucket(1, now.plus(window));
            }

            if (currentBucket.attempts() >= maxAttempts) {
                throw new RateLimitExceededException(
                        "Too many attempts. Try again later."
                );
            }

            return new RateLimitBucket(
                    currentBucket.attempts() + 1,
                    currentBucket.resetAt()
            );
        });
    }

    private String buildKey(String namespace, String identifier) {
        return namespace + ":" + identifier
                .trim()
                .toLowerCase(Locale.ROOT);
    }

    private record RateLimitBucket(
            int attempts,
            Instant resetAt
    ) {
    }
}
