package org.danielbreves.backend.dto.user;

import java.util.Date;

public record UserResponseDTO(
        Long id,
        String name,
        String username,
        String email
) {}
