package org.danielbreves.backend.dto.session;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import org.danielbreves.backend.entity.enums.SessionType;

public record CreateSessionRequestDTO(

        @NotNull(message = "O tipo da sessao e obrigatorio")
        SessionType type,

        @NotNull(message = "A duracao da sessao e obrigatoria")
        @PositiveOrZero(message = "A duracao da sessao nao pode ser negativa")
        Integer duration

) {}
