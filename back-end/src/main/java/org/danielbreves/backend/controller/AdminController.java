package org.danielbreves.backend.controller;

import org.danielbreves.backend.dto.admin.AdminAnalyticsResponseDTO;
import org.danielbreves.backend.service.AdminAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping(value = "/admin")
public class AdminController {

    private final AdminAnalyticsService adminAnalyticsService;

    public AdminController(AdminAnalyticsService adminAnalyticsService) {
        this.adminAnalyticsService = adminAnalyticsService;
    }

    @GetMapping("/analytics")
    public ResponseEntity<AdminAnalyticsResponseDTO> getAnalytics(
            Principal principal
    ) {
        String currentEmail = principal == null ? null : principal.getName();

        return ResponseEntity.ok(
                adminAnalyticsService.getAnalytics(currentEmail)
        );
    }
}
