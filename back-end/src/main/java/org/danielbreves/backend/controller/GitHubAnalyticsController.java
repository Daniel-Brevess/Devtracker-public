package org.danielbreves.backend.controller;

import org.danielbreves.backend.dto.github.GitHubAnalyticsResponseDTO;
import org.danielbreves.backend.service.GitHubAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping(value = "/github")
public class GitHubAnalyticsController {

    private final GitHubAnalyticsService gitHubAnalyticsService;

    public GitHubAnalyticsController(
            GitHubAnalyticsService gitHubAnalyticsService
    ) {
        this.gitHubAnalyticsService = gitHubAnalyticsService;
    }

    @GetMapping("/analytics")
    public ResponseEntity<GitHubAnalyticsResponseDTO> getAnalytics(
            Principal principal
    ) {
        GitHubAnalyticsResponseDTO response =
                gitHubAnalyticsService.getAnalytics(principal.getName());

        return ResponseEntity.ok(response);
    }
}
