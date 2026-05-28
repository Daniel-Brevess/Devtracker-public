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
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GitHubAnalyticsService {

    private static final String GITHUB_API_URL = "https://api.github.com";
    private static final String GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
    private static final int REPOSITORY_LIMIT = 12;
    private static final int DISPLAY_REPOSITORY_LIMIT = 5;
    private static final int STACK_LIMIT = 5;
    private static final Duration ANALYTICS_CACHE_TTL = Duration.ofMinutes(5);
    private static final ZoneId CONTRIBUTION_ZONE = ZoneId.of("America/Sao_Paulo");
    private static final String CONTRIBUTIONS_QUERY = """
            query($username: String!, $from: DateTime!, $to: DateTime!) {
              user(login: $username) {
                contributionsCollection(from: $from, to: $to) {
                  contributionCalendar {
                    weeks {
                      contributionDays {
                        date
                        contributionCount
                      }
                    }
                  }
                }
              }
            }
            """;

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
        Map<String, Integer> contributionCountByDate =
                buildContributionCountByDate(username, accessToken);
        List<GitHubCommitFrequencyDTO> frequency =
                buildSevenDayFrequency(contributionCountByDate);
        int totalRepos = repositories.size();
        int privateRepos = countRepositoriesByVisibility(repositories, true);
        int publicRepos = countRepositoriesByVisibility(repositories, false);

        int commitsLastSevenDays = frequency.stream()
                .mapToInt(GitHubCommitFrequencyDTO::commits)
                .sum();
        int commitsLastThirtyDays = contributionCountByDate.values().stream()
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

    private Map<String, Integer> buildContributionCountByDate(
            String username,
            String accessToken
    ) {
        if (accessToken == null || accessToken.isBlank()) {
            return new LinkedHashMap<>();
        }

        LocalDate today = LocalDate.now(CONTRIBUTION_ZONE);
        Instant from = today.minusDays(29)
                .atStartOfDay(CONTRIBUTION_ZONE)
                .toInstant();
        Instant to = today.plusDays(1)
                .atStartOfDay(CONTRIBUTION_ZONE)
                .minus(Duration.ofMillis(1))
                .toInstant();
        Map<String, Object> variables = Map.of(
                "username", username,
                "from", from.toString(),
                "to", to.toString()
        );
        Map<String, Object> payload = Map.of(
                "query", CONTRIBUTIONS_QUERY,
                "variables", variables
        );
        JsonNode response = sendGitHubGraphQLRequest(payload, accessToken);
        JsonNode contributionDays = response
                .path("data")
                .path("user")
                .path("contributionsCollection")
                .path("contributionCalendar")
                .path("weeks");
        Map<String, Integer> contributionCountByDate = new LinkedHashMap<>();

        for (JsonNode week : contributionDays) {
            for (JsonNode day : week.path("contributionDays")) {
                String date = day.path("date").asText("");
                int contributionCount = day.path("contributionCount").asInt(0);

                if (!date.isBlank()) {
                    contributionCountByDate.put(date, contributionCount);
                }
            }
        }

        return contributionCountByDate;
    }

    private List<GitHubCommitFrequencyDTO> buildSevenDayFrequency(
            Map<String, Integer> contributionCountByDate
    ) {
        LocalDate today = LocalDate.now(CONTRIBUTION_ZONE);
        List<GitHubCommitFrequencyDTO> frequency = new ArrayList<>();

        for (int index = 6; index >= 0; index--) {
            String date = today.minusDays(index).toString();

            frequency.add(new GitHubCommitFrequencyDTO(
                    date,
                    contributionCountByDate.getOrDefault(date, 0)
            ));
        }

        return frequency;
    }

    private JsonNode sendGitHubGraphQLRequest(
            Map<String, Object> payload,
            String accessToken
    ) {
        try {
            String body = objectMapper.writeValueAsString(payload);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(GITHUB_GRAPHQL_URL))
                    .header("Accept", "application/vnd.github+json")
                    .header("X-GitHub-Api-Version", "2022-11-28")
                    .header("User-Agent", "DevTracker")
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();
            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new ValidationException("GitHub contributions request failed");
            }

            JsonNode responseBody = objectMapper.readTree(response.body());

            if (responseBody.has("errors")) {
                throw new ValidationException("GitHub contributions request returned errors");
            }

            return responseBody;
        } catch (IOException exception) {
            throw new ValidationException("Could not communicate with GitHub");
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new ValidationException("GitHub contributions request was interrupted");
        }
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
