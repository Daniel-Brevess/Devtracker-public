package org.danielbreves.backend.dto.github;

public record GitHubCommitFrequencyDTO(
        String date,
        int commits
) {}
