package org.danielbreves.backend.dto.task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.danielbreves.backend.entity.enums.TaskPriority;

public record UpdateTaskRequestDTO(

        @NotBlank(message = "Title is required")
        @Size(max = 255, message = "Title must have at most 255 characters")
        String title,

        @Size(max = 255, message = "Description must have at most 255 characters")
        String description,

        @NotNull(message = "Priority is required")
        TaskPriority priority

) {}
