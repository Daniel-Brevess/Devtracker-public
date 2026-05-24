package org.danielbreves.backend.dto.goal;

import org.danielbreves.backend.entity.enums.GoalDifficulty;
import org.danielbreves.backend.entity.enums.GoalStatus;

import java.time.LocalDateTime;

public record UpdateGoalResponseDTO(
        Long id,
        Long idUser,
        String title,
        String description,
        GoalDifficulty difficulty,
        GoalStatus status,
        LocalDateTime createdAt
) {}
