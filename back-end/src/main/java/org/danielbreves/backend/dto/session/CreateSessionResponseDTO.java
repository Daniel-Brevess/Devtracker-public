package org.danielbreves.backend.dto.session;

import org.danielbreves.backend.entity.enums.SessionType;

import java.time.LocalDateTime;

public record CreateSessionResponseDTO(
        Long id,
        Long idUser,
        SessionType type,
        Integer duration,
        LocalDateTime createdAt
) {}
