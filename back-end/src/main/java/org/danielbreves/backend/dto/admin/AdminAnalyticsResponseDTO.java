package org.danielbreves.backend.dto.admin;

public record AdminAnalyticsResponseDTO(
        long totalUsers,
        long activeUsers,
        long githubUsers,
        long localUsers,
        long usersCreatedToday,
        long usersCreatedLastSevenDays
) {
}
