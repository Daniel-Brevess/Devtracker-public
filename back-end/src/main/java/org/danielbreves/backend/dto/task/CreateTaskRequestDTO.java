package org.danielbreves.backend.dto.task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.danielbreves.backend.entity.enums.TaskPriority;

public record CreateTaskRequestDTO(

        @NotBlank(message = "O titulo e obrigatorio")
        @Size(max = 255, message = "O titulo deve ter no maximo 255 caracteres")
        String title,

        @Size(max = 255, message = "A descricao deve ter no maximo 255 caracteres")
        String description,

        @NotNull(message = "A prioridade e obrigatoria")
        TaskPriority priority

) {}
