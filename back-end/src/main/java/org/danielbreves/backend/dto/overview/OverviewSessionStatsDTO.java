package org.danielbreves.backend.dto.overview;

import java.util.List;

public record OverviewSessionStatsDTO(
        int activeDaysLastSeven,
        int averageDuration,
        int currentStreak,
        int total,
        int totalDuration,
        List<OverviewSessionActivityDTO> weeklyActivity
) {
}
