package org.danielbreves.backend.dto.focus;

import jakarta.validation.constraints.NotNull;

public record DeleteFocusRequestDTO(

        @NotNull(message = "O id do focus e obrigatorio")
        Long id

) {}
