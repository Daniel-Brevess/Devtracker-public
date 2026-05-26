package org.danielbreves.backend.dto.auth;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GitHubUserDTO(
        Long id,
        String login,
        String name,
        String email,
        @JsonProperty("avatar_url")
        String avatarUrl
) {}
