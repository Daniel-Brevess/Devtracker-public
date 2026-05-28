package org.danielbreves.backend.dto.goal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.danielbreves.backend.entity.enums.GoalDifficulty;
import org.danielbreves.backend.entity.enums.GoalStatus;

public record UpdateGoalRequestDTO(

        @NotBlank(message = "Title is required")
        @Size(max = 255, message = "Title must have at most 255 characters")
        String title,

        @Size(max = 255, message = "Description must have at most 255 characters")
        String description,

        @NotNull(message = "Difficulty is required")
        GoalDifficulty difficulty,

        @NotNull(message = "Status is required")
        GoalStatus status

) {}
