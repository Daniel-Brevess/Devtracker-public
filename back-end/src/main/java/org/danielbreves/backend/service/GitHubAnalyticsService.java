package org.danielbreves.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.danielbreves.backend.dto.github.GitHubAnalyticsResponseDTO;
import org.danielbreves.backend.dto.github.GitHubCommitFrequencyDTO;
import org.danielbreves.backend.dto.github.GitHubLanguageStatsDTO;
import org.danielbreves.backend.dto.github.GitHubRepositoryStatsDTO;
import org.danielbreves.backend.entity.User;
import org.danielbreves.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class GitHubAnalyticsService {

    private static final String GITHUB_API_URL = "https://api.github.com";
    private static final int REPOSITORY_LIMIT = 12;
    private static final int DISPLAY_REPOSITORY_LIMIT = 5;
    private static final int STACK_LIMIT = 5;

    private final UserRepository userRepository;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public GitHubAnalyticsService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    public GitHubAnalyticsResponseDTO getAnalytics(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));

        if (
                user.getGithubUsername() == null ||
                user.getGithubUsername().isBlank()
        ) {
            return GitHubAnalyticsResponseDTO.disconnected();
        }

        try {
            return buildAnalytics(user.getGithubUsername());
        } catch (RuntimeException exception) {
            return GitHubAnalyticsResponseDTO.disconnected();
        }
    }

    private GitHubAnalyticsResponseDTO buildAnalytics(String username) {
        JsonNode repositories = requestRepositories(username);
        List<JsonNode> selectedRepositories = selectRepositories(repositories);
        List<GitHubRepositoryStatsDTO> repositoryStats =
                buildRepositoryStats(selectedRepositories);
        List<GitHubLanguageStatsDTO> stacks =
                buildLanguageStats(username, selectedRepositories);
        Map<String, Integer> commitCountByDate =
                buildCommitCountByDate(username, selectedRepositories);
        List<GitHubCommitFrequencyDTO> frequency =
                buildSevenDayFrequency(commitCountByDate);

        int commitsLastSevenDays = frequency.stream()
                .mapToInt(GitHubCommitFrequencyDTO::commits)
                .sum();
        int commitsLastThirtyDays = commitCountByDate.values().stream()
                .mapToInt(Integer::intValue)
                .sum();

        return new GitHubAnalyticsResponseDTO(
                true,
                username,
                repositories.size(),
                commitsLastSevenDays,
                commitsLastThirtyDays,
                stacks,
                repositoryStats,
                frequency
        );
    }

    private JsonNode requestRepositories(String username) {
        URI uri = UriComponentsBuilder
                .fromUriString(GITHUB_API_URL + "/users/{username}/repos")
                .queryParam("sort", "updated")
                .queryParam("direction", "desc")
                .queryParam("per_page", 100)
                .encode()
                .buildAndExpand(username)
                .toUri();

        return sendGitHubRequest(uri);
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
                        repository.path("stargazers_count").asInt(0),
                        repository.path("forks_count").asInt(0),
                        repository.path("updated_at").asText()
                ))
                .toList();
    }

    private List<GitHubLanguageStatsDTO> buildLanguageStats(
            String username,
            List<JsonNode> repositories
    ) {
        Map<String, Long> bytesByLanguage = new HashMap<>();

        for (JsonNode repository : repositories) {
            String repositoryName = repository.path("name").asText();
            JsonNode languages = requestRepositoryLanguages(username, repositoryName);

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
            String username,
            String repositoryName
    ) {
        URI uri = UriComponentsBuilder
                .fromUriString(GITHUB_API_URL + "/repos/{username}/{repository}/languages")
                .encode()
                .buildAndExpand(username, repositoryName)
                .toUri();

        return sendGitHubRequest(uri);
    }

    private Map<String, Integer> buildCommitCountByDate(
            String username,
            List<JsonNode> repositories
    ) {
        Map<String, Integer> commitCountByDate = new LinkedHashMap<>();
        String since = OffsetDateTime
                .now(ZoneOffset.UTC)
                .minusDays(30)
                .toString();

        for (JsonNode repository : repositories) {
            String repositoryName = repository.path("name").asText();
            JsonNode commits = requestRepositoryCommits(
                    username,
                    repositoryName,
                    since
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
            String repositoryName,
            String since
    ) {
        URI uri = UriComponentsBuilder
                .fromUriString(GITHUB_API_URL + "/repos/{username}/{repository}/commits")
                .queryParam("author", username)
                .queryParam("since", since)
                .queryParam("per_page", 100)
                .encode()
                .buildAndExpand(username, repositoryName)
                .toUri();

        return sendGitHubRequest(uri);
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

    private JsonNode sendGitHubRequest(URI uri) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(uri)
                .header("Accept", "application/vnd.github+json")
                .header("X-GitHub-Api-Version", "2022-11-28")
                .header("User-Agent", "DevTracker")
                .GET()
                .build();

        try {
            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() == 404 || response.statusCode() == 409) {
                return objectMapper.readTree("[]");
            }

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new RuntimeException("GitHub analytics request failed");
            }

            return objectMapper.readTree(response.body());
        } catch (IOException exception) {
            throw new RuntimeException("Could not communicate with GitHub");
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("GitHub analytics request was interrupted");
        }
    }

    private String nullableText(JsonNode node) {
        if (node == null || node.isNull()) {
            return null;
        }

        return node.asText();
    }
}
