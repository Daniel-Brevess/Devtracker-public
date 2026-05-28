package org.danielbreves.backend.dto.focus;

import jakarta.validation.constraints.NotNull;

public record DeleteFocusRequestDTO(

        @NotNull(message = "Focus id is required")
        Long id

) {}
