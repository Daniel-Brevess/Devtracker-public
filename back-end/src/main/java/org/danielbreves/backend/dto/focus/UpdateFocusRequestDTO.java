package org.danielbreves.backend.dto.focus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateFocusRequestDTO(

        @NotNull(message = "Focus id is required")
        Long id,

        @NotBlank(message = "Title is required")
        @Size(max = 255, message = "Title must have at most 255 characters")
        String title

) {}
