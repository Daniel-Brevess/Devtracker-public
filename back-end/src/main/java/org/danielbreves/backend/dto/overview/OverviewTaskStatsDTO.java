package org.danielbreves.backend.dto.overview;

public record OverviewTaskStatsDTO(
        int completed,
        int completionRate,
        int pending,
        int total
) {
}
