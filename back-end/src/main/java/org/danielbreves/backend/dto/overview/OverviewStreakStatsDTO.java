package org.danielbreves.backend.dto.overview;

public record OverviewStreakStatsDTO(
        int activeDaysLastSeven,
        int currentStreak
) {
}
