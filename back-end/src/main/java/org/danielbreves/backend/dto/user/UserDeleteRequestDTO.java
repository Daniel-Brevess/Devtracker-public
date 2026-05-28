package org.danielbreves.backend.dto.user;

public record UserDeleteRequestDTO(
        String password,
        String confirmationEmail
) {
}
