package org.danielbreves.backend.dto.auth;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GitHubEmailDTO(
        String email,
        Boolean primary,
        Boolean verified,
        String visibility
) {}
