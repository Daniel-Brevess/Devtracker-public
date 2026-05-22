package org.danielbreves.backend.dto.task;

import org.danielbreves.backend.entity.enums.TaskPriority;

import java.time.LocalDateTime;

public record CreateTaskResponseDTO(
        Long id,
        Long idFocus,
        String title,
        String description,
        TaskPriority priority,
        Boolean status,
        LocalDateTime createdAt
) {}
