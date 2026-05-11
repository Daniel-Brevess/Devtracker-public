package org.danielbreves.backend.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRequestDTO(

        @NotBlank(message = "O nome é obrigatório")
        @Size(min = 2, max = 80, message = "O nome deve ter entre 2 e 80 caracteres")
        String name,

        @Size(min = 3, max = 30, message = "O username deve ter entre 3 e 30 caracteres")
        @Pattern(
                regexp = "^[a-zA-Z0-9._]+$",
                message = "O username só pode conter letras, números, ponto e underline"
        )
        String username,

        @NotBlank(message = "O email é obrigatório")
        @Email(message = "Email inválido")
        @Size(max = 120, message = "O email deve ter no máximo 120 caracteres")
        String email,

        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 8, max = 72, message = "A senha deve ter entre 8 e 72 caracteres")
        String password

) {}
