package org.danielbreves.backend.dto.user;

import org.danielbreves.backend.entity.enums.AuthProvider;

public record LoginResponseDTO(
        Long id,
        String name,
        String username,
        String email,
        String githubUsername,
        String avatarUrl,
        AuthProvider authProvider,
        String message,
        String token
) {}
