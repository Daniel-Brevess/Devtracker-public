package org.danielbreves.backend.dto.session;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import org.danielbreves.backend.entity.enums.SessionType;

public record CreateSessionRequestDTO(

        @NotNull(message = "Session type is required")
        SessionType type,

        @NotNull(message = "Session duration is required")
        @PositiveOrZero(message = "Session duration cannot be negative")
        Integer duration

) {}
