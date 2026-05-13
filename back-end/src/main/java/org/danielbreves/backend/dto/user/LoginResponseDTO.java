package org.danielbreves.backend.dto.user;

public record LoginResponseDTO(
        Long id,
        String name,
        String username,
        String email,
        String message,
        String token
) {}
