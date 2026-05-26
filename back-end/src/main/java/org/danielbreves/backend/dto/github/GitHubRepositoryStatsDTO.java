package org.danielbreves.backend.dto.github;

public record GitHubRepositoryStatsDTO(
        String name,
        String url,
        String mainLanguage,
        int stars,
        int forks,
        String updatedAt
) {}
