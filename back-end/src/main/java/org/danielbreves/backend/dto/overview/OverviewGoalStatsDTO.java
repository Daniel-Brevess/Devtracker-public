package org.danielbreves.backend.dto.overview;

public record OverviewGoalStatsDTO(
        int completed,
        int discarded,
        int inProgress,
        int pending,
        int total
) {
}
