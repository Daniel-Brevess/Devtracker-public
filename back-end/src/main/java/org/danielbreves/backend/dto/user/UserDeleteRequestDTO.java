package org.danielbreves.backend.dto.user;

import jakarta.validation.constraints.NotBlank;

public record UserDeleteRequestDTO(
        @NotBlank(message = "Password is required")
        String password
) {
}
