package org.danielbreves.backend.service;

import org.danielbreves.backend.dto.github.GitHubAnalyticsResponseDTO;
import org.danielbreves.backend.dto.overview.OverviewFocusStatsDTO;
import org.danielbreves.backend.dto.overview.OverviewGoalStatsDTO;
import org.danielbreves.backend.dto.overview.OverviewResponseDTO;
import org.danielbreves.backend.dto.overview.OverviewSessionActivityDTO;
import org.danielbreves.backend.dto.overview.OverviewSessionStatsDTO;
import org.danielbreves.backend.dto.overview.OverviewStreakStatsDTO;
import org.danielbreves.backend.dto.overview.OverviewTaskStatsDTO;
import org.danielbreves.backend.entity.Focus;
import org.danielbreves.backend.entity.Goal;
import org.danielbreves.backend.entity.Session;
import org.danielbreves.backend.entity.Task;
import org.danielbreves.backend.entity.User;
import org.danielbreves.backend.entity.enums.GoalStatus;
import org.danielbreves.backend.exception.NotFoundException;
import org.danielbreves.backend.repository.FocusRepository;
import org.danielbreves.backend.repository.GoalRepository;
import org.danielbreves.backend.repository.SessionRepository;
import org.danielbreves.backend.repository.TaskRepository;
import org.danielbreves.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OverviewService {
    private static final ZoneId ACTIVITY_ZONE = ZoneId.of("America/Sao_Paulo");

    private final FocusRepository focusRepository;
    private final GoalRepository goalRepository;
    private final SessionRepository sessionRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final GitHubAnalyticsService gitHubAnalyticsService;

    public OverviewService(
            FocusRepository focusRepository,
            GoalRepository goalRepository,
            SessionRepository sessionRepository,
            TaskRepository taskRepository,
            UserRepository userRepository,
            GitHubAnalyticsService gitHubAnalyticsService
    ) {
        this.focusRepository = focusRepository;
        this.goalRepository = goalRepository;
        this.sessionRepository = sessionRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.gitHubAnalyticsService = gitHubAnalyticsService;
    }

    public OverviewResponseDTO getOverview(String currentEmail) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));
        List<Focus> focuses = focusRepository.findAllByUser(user);
        List<Task> tasks = taskRepository.findAllByFocus_User(user);
        List<Goal> goals = goalRepository.findAllByIdUser(user.getId());
        List<Session> sessions = sessionRepository.findAllByUser(user);
        GitHubAnalyticsResponseDTO github =
                gitHubAnalyticsService.getAnalytics(currentEmail);
        OverviewSessionStatsDTO sessionStats = buildSessionStats(sessions);
        OverviewStreakStatsDTO streakStats = github.connected()
                ? buildGitHubStreakStats(github)
                : new OverviewStreakStatsDTO(
                        sessionStats.activeDaysLastSeven(),
                        sessionStats.currentStreak()
                );

        return new OverviewResponseDTO(
                buildFocusStats(focuses, tasks),
                buildGoalStats(goals),
                github,
                sessionStats,
                streakStats,
                buildTaskStats(tasks)
        );
    }

    private OverviewFocusStatsDTO buildFocusStats(
            List<Focus> focuses,
            List<Task> tasks
    ) {
        Map<Long, Long> tasksByFocus = tasks.stream()
                .collect(Collectors.groupingBy(
                        task -> task.getFocus().getId(),
                        Collectors.counting()
                ));
        String activeFocus = focuses.stream()
                .max((firstFocus, secondFocus) -> Long.compare(
                        tasksByFocus.getOrDefault(firstFocus.getId(), 0L),
                        tasksByFocus.getOrDefault(secondFocus.getId(), 0L)
                ))
                .map(Focus::getTitle)
                .orElse("None");

        return new OverviewFocusStatsDTO(activeFocus, focuses.size());
    }

    private OverviewGoalStatsDTO buildGoalStats(List<Goal> goals) {
        return new OverviewGoalStatsDTO(
                countGoalsByStatus(goals, GoalStatus.DONE),
                countGoalsByStatus(goals, GoalStatus.DISCARDED),
                countGoalsByStatus(goals, GoalStatus.IN_PROGRESS),
                countGoalsByStatus(goals, GoalStatus.TODO),
                goals.size()
        );
    }

    private OverviewSessionStatsDTO buildSessionStats(List<Session> sessions) {
        int totalDuration = sessions.stream()
                .mapToInt(session -> safeDuration(session.getDurationSeconds()))
                .sum();
        int averageDuration = sessions.isEmpty()
                ? 0
                : Math.round((float) totalDuration / sessions.size());
        Map<String, Integer> durationByDate = sessions.stream()
                .filter(session -> session.getCreatedAt() != null)
                .collect(Collectors.toMap(
                        session -> session.getCreatedAt().toLocalDate().toString(),
                        session -> safeDuration(session.getDurationSeconds()),
                        Integer::sum,
                        LinkedHashMap::new
                ));
        List<OverviewSessionActivityDTO> weeklyActivity =
                getLastSevenDays().stream()
                        .map(date -> new OverviewSessionActivityDTO(
                                date,
                                durationByDate.getOrDefault(date, 0)
                        ))
                        .toList();
        Set<String> activeDateKeys = durationByDate.entrySet().stream()
                .filter(entry -> entry.getValue() > 0)
                .map(Map.Entry::getKey)
                .collect(Collectors.toSet());

        return new OverviewSessionStatsDTO(
                (int) weeklyActivity.stream()
                        .filter(day -> day.duration() > 0)
                        .count(),
                averageDuration,
                getCurrentStreak(activeDateKeys),
                sessions.size(),
                totalDuration,
                weeklyActivity
        );
    }

    private OverviewStreakStatsDTO buildGitHubStreakStats(
            GitHubAnalyticsResponseDTO github
    ) {
        Set<String> activeDateKeys = github.frequency().stream()
                .filter(day -> day.commits() > 0)
                .map(day -> day.date())
                .collect(Collectors.toSet());

        return new OverviewStreakStatsDTO(
                (int) github.frequency().stream()
                        .filter(day -> day.commits() > 0)
                        .count(),
                getCurrentStreak(activeDateKeys)
        );
    }

    private OverviewTaskStatsDTO buildTaskStats(List<Task> tasks) {
        int completed = (int) tasks.stream()
                .filter(task -> Boolean.TRUE.equals(task.getStatus()))
                .count();
        int total = tasks.size();
        int pending = total - completed;
        int completionRate = total > 0
                ? Math.round((completed * 100f) / total)
                : 0;

        return new OverviewTaskStatsDTO(
                completed,
                completionRate,
                pending,
                total
        );
    }

    private int countGoalsByStatus(List<Goal> goals, GoalStatus status) {
        return (int) goals.stream()
                .filter(goal -> goal.getStatus() == status)
                .count();
    }

    private int safeDuration(Integer duration) {
        return duration == null ? 0 : duration;
    }

    private List<String> getLastSevenDays() {
        LocalDate today = LocalDate.now(ACTIVITY_ZONE);

        return java.util.stream.IntStream.rangeClosed(0, 6)
                .mapToObj(index -> today.minusDays(6L - index).toString())
                .toList();
    }

    private int getCurrentStreak(Set<String> activeDateKeys) {
        int streak = 0;
        LocalDate cursor = LocalDate.now(ACTIVITY_ZONE);

        if (!activeDateKeys.contains(cursor.toString())) {
            cursor = cursor.minusDays(1);
        }

        while (activeDateKeys.contains(cursor.toString())) {
            streak++;
            cursor = cursor.minusDays(1);
        }

        return streak;
    }
}
