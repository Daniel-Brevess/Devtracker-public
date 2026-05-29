package org.danielbreves.backend.service;

import org.danielbreves.backend.exception.ForbiddenException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class AdminAccessServiceTest {

    @Test
    void requireAdminAllowsConfiguredEmailIgnoringCase() {
        AdminAccessService adminAccessService =
                new AdminAccessService("danielbreves1.20@gmail.com");

        assertDoesNotThrow(
                () -> adminAccessService.requireAdmin("DanielBreves1.20@gmail.com")
        );
    }

    @Test
    void requireAdminRejectsUnknownEmail() {
        AdminAccessService adminAccessService =
                new AdminAccessService("danielbreves1.20@gmail.com");

        ForbiddenException exception = assertThrows(
                ForbiddenException.class,
                () -> adminAccessService.requireAdmin("other@test.com")
        );

        assertEquals("Admin access required", exception.getMessage());
    }

    @Test
    void requireAdminRejectsWhenNoAdminEmailIsConfigured() {
        AdminAccessService adminAccessService = new AdminAccessService("");

        ForbiddenException exception = assertThrows(
                ForbiddenException.class,
                () -> adminAccessService.requireAdmin("danielbreves1.20@gmail.com")
        );

        assertEquals("Admin access required", exception.getMessage());
    }
}
