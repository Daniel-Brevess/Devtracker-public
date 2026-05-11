package org.danielbreves.backend.dto.user;

public record UserResponseDTO(
        Long id,
        String name,
        String username,
        String email
) {}
