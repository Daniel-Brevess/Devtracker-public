package org.danielbreves.backend.service;

import org.danielbreves.backend.exception.ForbiddenException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminAccessService {

    private final Set<String> adminEmails;

    public AdminAccessService(
            @Value("${app.admin.emails:}") String adminEmails
    ) {
        this.adminEmails = Arrays.stream(adminEmails.split(","))
                .map(String::trim)
                .filter(email -> !email.isBlank())
                .map(AdminAccessService::normalizeEmail)
                .collect(Collectors.toUnmodifiableSet());
    }

    public void requireAdmin(String currentEmail) {
        if (currentEmail == null || !adminEmails.contains(normalizeEmail(currentEmail))) {
            throw new ForbiddenException("Admin access required");
        }
    }

    private static String normalizeEmail(String email) {
        return email.toLowerCase(Locale.ROOT);
    }
}
