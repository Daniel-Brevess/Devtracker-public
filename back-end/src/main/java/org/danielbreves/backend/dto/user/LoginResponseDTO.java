package org.danielbreves.backend.dto.user;

public record LoginResponseDTO(
        Long id,
        String name,
        String email,
        String message,
        String token
) {}
