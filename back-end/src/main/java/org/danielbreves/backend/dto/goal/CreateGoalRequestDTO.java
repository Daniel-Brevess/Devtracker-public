package org.danielbreves.backend.dto.goal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.danielbreves.backend.entity.enums.GoalDifficulty;
import org.danielbreves.backend.entity.enums.GoalStatus;

public record CreateGoalRequestDTO(

        @NotBlank(message = "O titulo e obrigatorio")
        @Size(max = 255, message = "O titulo deve ter no maximo 255 caracteres")
        String title,

        @Size(max = 255, message = "A descricao deve ter no maximo 255 caracteres")
        String description,

        @NotNull(message = "A dificuldade e obrigatoria")
        GoalDifficulty difficulty,

        GoalStatus status

) {}
