package org.danielbreves.backend.service;

import org.danielbreves.backend.dto.admin.AdminAnalyticsResponseDTO;
import org.danielbreves.backend.entity.enums.AuthProvider;
import org.danielbreves.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

@Service
public class AdminAnalyticsService {

    private static final ZoneId ANALYTICS_ZONE = ZoneId.of("America/Sao_Paulo");
    private static final Duration ACTIVE_USER_WINDOW = Duration.ofMinutes(5);

    private final UserRepository userRepository;
    private final AdminAccessService adminAccessService;

    public AdminAnalyticsService(
            UserRepository userRepository,
            AdminAccessService adminAccessService
    ) {
        this.userRepository = userRepository;
        this.adminAccessService = adminAccessService;
    }

    public AdminAnalyticsResponseDTO getAnalytics(String currentEmail) {
        adminAccessService.requireAdmin(currentEmail);

        Date todayStart = toDate(LocalDate.now(ANALYTICS_ZONE));
        Date lastSevenDaysStart =
                toDate(LocalDate.now(ANALYTICS_ZONE).minusDays(6));
        Date activeUserWindowStart =
                Date.from(Instant.now().minus(ACTIVE_USER_WINDOW));

        return new AdminAnalyticsResponseDTO(
                userRepository.count(),
                userRepository.countByLastSeenAtGreaterThanEqual(activeUserWindowStart),
                userRepository.countByAuthProvider(AuthProvider.GITHUB),
                userRepository.countByAuthProvider(AuthProvider.LOCAL),
                userRepository.countByCreatedAtGreaterThanEqual(todayStart),
                userRepository.countByCreatedAtGreaterThanEqual(lastSevenDaysStart)
        );
    }

    private Date toDate(LocalDate date) {
        return Date.from(date.atStartOfDay(ANALYTICS_ZONE).toInstant());
    }
}
