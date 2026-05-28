package org.danielbreves.backend.dto.overview;

import org.danielbreves.backend.dto.github.GitHubAnalyticsResponseDTO;

public record OverviewResponseDTO(
        OverviewFocusStatsDTO focuses,
        OverviewGoalStatsDTO goals,
        GitHubAnalyticsResponseDTO github,
        OverviewSessionStatsDTO sessions,
        OverviewStreakStatsDTO streak,
        OverviewTaskStatsDTO tasks
) {
}
