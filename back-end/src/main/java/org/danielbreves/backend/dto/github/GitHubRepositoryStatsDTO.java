package org.danielbreves.backend.dto.github;

public record GitHubRepositoryStatsDTO(
        String name,
        String url,
        String mainLanguage,
        boolean privateRepository,
        int stars,
        int forks,
        String updatedAt
) {}
