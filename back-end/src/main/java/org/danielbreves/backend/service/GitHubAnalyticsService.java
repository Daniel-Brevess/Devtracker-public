package org.danielbreves.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.danielbreves.backend.dto.github.GitHubAnalyticsResponseDTO;
import org.danielbreves.backend.dto.github.GitHubCommitFrequencyDTO;
import org.danielbreves.backend.dto.github.GitHubLanguageStatsDTO;
import org.danielbreves.backend.dto.github.GitHubRepositoryStatsDTO;
import org.danielbreves.backend.entity.User;
import org.danielbreves.backend.exception.NotFoundException;
import org.danielbreves.backend.exception.ValidationException;
import org.danielbreves.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GitHubAnalyticsService {

    private static final String GITHUB_API_URL = "https://api.github.com";
    private static final int REPOSITORY_LIMIT = 12;
    private static final int DISPLAY_REPOSITORY_LIMIT = 5;
    private static final int STACK_LIMIT = 5;
    private static final Duration ANALYTICS_CACHE_TTL = Duration.ofMinutes(5);

    private final UserRepository userRepository;
    private final GitHubTokenCryptoService gitHubTokenCryptoService;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final ConcurrentHashMap<Long, CachedGitHubAnalytics> analyticsCache =
            new ConcurrentHashMap<>();

    public GitHubAnalyticsService(
            UserRepository userRepository,
            GitHubTokenCryptoService gitHubTokenCryptoService
    ) {
        this.userRepository = userRepository;
        this.gitHubTokenCryptoService = gitHubTokenCryptoService;
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    public GitHubAnalyticsResponseDTO getAnalytics(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));
        GitHubAnalyticsResponseDTO cachedAnalytics = getCachedAnalytics(user);

        if (cachedAnalytics != null) {
            return cachedAnalytics;
        }

        if (
                user.getGithubUsername() == null ||
                user.getGithubUsername().isBlank()
        ) {
            return GitHubAnalyticsResponseDTO.disconnected();
        }

        try {
            String accessToken =
                    gitHubTokenCryptoService.decrypt(user.getGithubAccessToken());
            GitHubAnalyticsResponseDTO analytics =
                    buildAnalytics(user.getGithubUsername(), accessToken);

            cacheAnalytics(user, analytics);

            return analytics;
        } catch (RuntimeException exception) {
            return GitHubAnalyticsResponseDTO.disconnected();
        }
    }

    private GitHubAnalyticsResponseDTO buildAnalytics(
            String username,
            String accessToken
    ) {
        boolean privateAccessEnabled =
                accessToken != null && !accessToken.isBlank();
        JsonNode repositories = requestRepositories(username, accessToken);
        List<JsonNode> selectedRepositories = selectRepositories(repositories);
        List<GitHubRepositoryStatsDTO> repositoryStats =
                buildRepositoryStats(selectedRepositories);
        List<GitHubLanguageStatsDTO> stacks =
                buildLanguageStats(selectedRepositories, accessToken);
        Map<String, Integer> commitCountByDate =
                buildCommitCountByDate(username, selectedRepositories, accessToken);
        List<GitHubCommitFrequencyDTO> frequency =
                buildSevenDayFrequency(commitCountByDate);
        int totalRepos = repositories.size();
        int privateRepos = countRepositoriesByVisibility(repositories, true);
        int publicRepos = countRepositoriesByVisibility(repositories, false);

        int commitsLastSevenDays = frequency.stream()
                .mapToInt(GitHubCommitFrequencyDTO::commits)
                .sum();
        int commitsLastThirtyDays = commitCountByDate.values().stream()
                .mapToInt(Integer::intValue)
                .sum();

        return new GitHubAnalyticsResponseDTO(
                true,
                username,
                privateAccessEnabled,
                totalRepos,
                publicRepos,
                privateRepos,
                commitsLastSevenDays,
                commitsLastThirtyDays,
                stacks,
                repositoryStats,
                frequency
        );
    }

    private JsonNode requestRepositories(String username, String accessToken) {
        if (accessToken != null && !accessToken.isBlank()) {
            URI uri = UriComponentsBuilder
                    .fromUriString(GITHUB_API_URL + "/user/repos")
                    .queryParam("visibility", "all")
                    .queryParam(
                            "affiliation",
                            "owner,collaborator,organization_member"
                    )
                    .queryParam("sort", "updated")
                    .queryParam("direction", "desc")
                    .queryParam("per_page", 100)
                    .encode()
                    .build()
                    .toUri();

            return sendGitHubRequest(uri, accessToken);
        }

        URI uri = UriComponentsBuilder
                .fromUriString(GITHUB_API_URL + "/users/{username}/repos")
                .queryParam("sort", "updated")
                .queryParam("direction", "desc")
                .queryParam("per_page", 100)
                .encode()
                .buildAndExpand(username)
                .toUri();

        return sendGitHubRequest(uri, null);
    }

    private List<JsonNode> selectRepositories(JsonNode repositories) {
        List<JsonNode> selectedRepositories = new ArrayList<>();

        for (JsonNode repository : repositories) {
            if (selectedRepositories.size() >= REPOSITORY_LIMIT) {
                break;
            }

            if (!repository.path("fork").asBoolean(false)) {
                selectedRepositories.add(repository);
            }
        }

        return selectedRepositories;
    }

    private List<GitHubRepositoryStatsDTO> buildRepositoryStats(
            List<JsonNode> repositories
    ) {
        return repositories.stream()
                .limit(DISPLAY_REPOSITORY_LIMIT)
                .map(repository -> new GitHubRepositoryStatsDTO(
                        repository.path("name").asText(),
                        repository.path("html_url").asText(),
                        nullableText(repository.path("language")),
                        repository.path("private").asBoolean(false),
                        repository.path("stargazers_count").asInt(0),
                        repository.path("forks_count").asInt(0),
                        repository.path("updated_at").asText()
                ))
                .toList();
    }

    private List<GitHubLanguageStatsDTO> buildLanguageStats(
            List<JsonNode> repositories,
            String accessToken
    ) {
        Map<String, Long> bytesByLanguage = new HashMap<>();

        for (JsonNode repository : repositories) {
            JsonNode languages = requestRepositoryLanguages(repository, accessToken);

            languages.fields().forEachRemaining(language -> bytesByLanguage.merge(
                    language.getKey(),
                    language.getValue().asLong(0),
                    Long::sum
            ));
        }

        long totalBytes = bytesByLanguage.values().stream()
                .mapToLong(Long::longValue)
                .sum();

        if (totalBytes == 0) {
            return List.of();
        }

        return bytesByLanguage.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(STACK_LIMIT)
                .map(entry -> new GitHubLanguageStatsDTO(
                        entry.getKey(),
                        entry.getValue(),
                        Math.round((entry.getValue() * 100f) / totalBytes)
                ))
                .toList();
    }

    private JsonNode requestRepositoryLanguages(
            JsonNode repository,
            String accessToken
    ) {
        String[] ownerAndRepository = resolveOwnerAndRepository(repository);
        URI uri = UriComponentsBuilder
                .fromUriString(GITHUB_API_URL + "/repos/{username}/{repository}/languages")
                .encode()
                .buildAndExpand(ownerAndRepository[0], ownerAndRepository[1])
                .toUri();

        return sendGitHubRequest(uri, accessToken);
    }

    private Map<String, Integer> buildCommitCountByDate(
            String username,
            List<JsonNode> repositories,
            String accessToken
    ) {
        Map<String, Integer> commitCountByDate = new LinkedHashMap<>();
        String since = OffsetDateTime
                .now(ZoneOffset.UTC)
                .minusDays(30)
                .toString();

        for (JsonNode repository : repositories) {
            JsonNode commits = requestRepositoryCommits(
                username,
                    repository,
                    since,
                    accessToken
            );

            for (JsonNode commit : commits) {
                String date = commit
                        .path("commit")
                        .path("author")
                        .path("date")
                        .asText("");

                if (!date.isBlank()) {
                    String dateKey = OffsetDateTime.parse(date)
                            .toLocalDate()
                            .toString();
                    commitCountByDate.merge(dateKey, 1, Integer::sum);
                }
            }
        }

        return commitCountByDate;
    }

    private JsonNode requestRepositoryCommits(
            String username,
            JsonNode repository,
            String since,
            String accessToken
    ) {
        String[] ownerAndRepository = resolveOwnerAndRepository(repository);
        URI uri = UriComponentsBuilder
                .fromUriString(GITHUB_API_URL + "/repos/{username}/{repository}/commits")
                .queryParam("author", username)
                .queryParam("since", since)
                .queryParam("per_page", 100)
                .encode()
                .buildAndExpand(ownerAndRepository[0], ownerAndRepository[1])
                .toUri();

        return sendGitHubRequest(uri, accessToken);
    }

    private List<GitHubCommitFrequencyDTO> buildSevenDayFrequency(
            Map<String, Integer> commitCountByDate
    ) {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        List<GitHubCommitFrequencyDTO> frequency = new ArrayList<>();

        for (int index = 6; index >= 0; index--) {
            String date = today.minusDays(index).toString();

            frequency.add(new GitHubCommitFrequencyDTO(
                    date,
                    commitCountByDate.getOrDefault(date, 0)
            ));
        }

        return frequency;
    }

    private JsonNode sendGitHubRequest(URI uri, String accessToken) {
        HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
                .uri(uri)
                .header("Accept", "application/vnd.github+json")
                .header("X-GitHub-Api-Version", "2022-11-28")
                .header("User-Agent", "DevTracker")
                .GET();

        if (accessToken != null && !accessToken.isBlank()) {
            requestBuilder.header("Authorization", "Bearer " + accessToken);
        }

        try {
            HttpResponse<String> response = httpClient.send(
                    requestBuilder.build(),
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() == 404 || response.statusCode() == 409) {
                return objectMapper.readTree("[]");
            }

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new ValidationException("GitHub analytics request failed");
            }

            return objectMapper.readTree(response.body());
        } catch (IOException exception) {
            throw new ValidationException("Could not communicate with GitHub");
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new ValidationException("GitHub analytics request was interrupted");
        }
    }

    private String nullableText(JsonNode node) {
        if (node == null || node.isNull()) {
            return null;
        }

        return node.asText();
    }

    private int countRepositoriesByVisibility(
            JsonNode repositories,
            boolean privateRepository
    ) {
        int total = 0;

        for (JsonNode repository : repositories) {
            if (repository.path("private").asBoolean(false) == privateRepository) {
                total += 1;
            }
        }

        return total;
    }

    private String[] resolveOwnerAndRepository(JsonNode repository) {
        String fullName = repository.path("full_name").asText("");

        if (fullName.contains("/")) {
            return fullName.split("/", 2);
        }

        String owner = repository
                .path("owner")
                .path("login")
                .asText("");

        return new String[] { owner, repository.path("name").asText() };
    }

    private GitHubAnalyticsResponseDTO getCachedAnalytics(User user) {
        if (user.getId() == null) {
            return null;
        }

        CachedGitHubAnalytics cachedAnalytics = analyticsCache.get(user.getId());

        if (cachedAnalytics == null) {
            return null;
        }

        if (!cachedAnalytics.expiresAt().isAfter(Instant.now())) {
            analyticsCache.remove(user.getId());
            return null;
        }

        return cachedAnalytics.analytics();
    }

    private void cacheAnalytics(
            User user,
            GitHubAnalyticsResponseDTO analytics
    ) {
        if (user.getId() == null || !analytics.connected()) {
            return;
        }

        analyticsCache.put(
                user.getId(),
                new CachedGitHubAnalytics(
                        analytics,
                        Instant.now().plus(ANALYTICS_CACHE_TTL)
                )
        );
    }

    private record CachedGitHubAnalytics(
            GitHubAnalyticsResponseDTO analytics,
            Instant expiresAt
    ) {
    }
}
