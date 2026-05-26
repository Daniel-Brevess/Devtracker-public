package org.danielbreves.backend.dto.github;

public record GitHubLanguageStatsDTO(
        String name,
        long bytes,
        int percentage
) {}
