package org.danielbreves.backend.dto.github;

import java.util.List;

public record GitHubAnalyticsResponseDTO(
        boolean connected,
        String username,
        boolean privateAccessEnabled,
        int totalRepos,
        int publicRepos,
        int privateRepos,
        int commitsLastSevenDays,
        int commitsLastThirtyDays,
        List<GitHubLanguageStatsDTO> stacks,
        List<GitHubRepositoryStatsDTO> repositories,
        List<GitHubCommitFrequencyDTO> frequency
) {
    public static GitHubAnalyticsResponseDTO disconnected() {
        return new GitHubAnalyticsResponseDTO(
                false,
                null,
                false,
                0,
                0,
                0,
                0,
                0,
                List.of(),
                List.of(),
                List.of()
        );
    }
}
