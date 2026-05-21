package org.danielbreves.backend.dto.focus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateFocusRequestDTO(

        @NotBlank(message = "O titulo e obrigatorio")
        @Size(max = 255, message = "O titulo deve ter no maximo 255 caracteres")
        String title

) {}
