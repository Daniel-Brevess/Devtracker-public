package org.danielbreves.backend.dto.focus;

import java.time.LocalDateTime;

public record FocusResponseDTO(
        Long id,
        Long idUser,
        String title,
        LocalDateTime createdAt
) {}
