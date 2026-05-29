package org.danielbreves.backend.dto.session;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Max;
import org.danielbreves.backend.entity.enums.SessionType;

public record CreateSessionRequestDTO(

        @NotNull(message = "Session type is required")
        SessionType type,

        @NotNull(message = "Session duration is required")
        @Max(value = 43200, message = "Session duration must have at most 12 hours")
        @PositiveOrZero(message = "Session duration cannot be negative")
        Integer duration

) {}
