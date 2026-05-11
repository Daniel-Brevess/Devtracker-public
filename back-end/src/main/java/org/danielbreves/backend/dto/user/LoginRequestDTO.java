package org.danielbreves.backend.dto.user;

public record LoginRequestDTO(
        String email,
        String password
) {}
