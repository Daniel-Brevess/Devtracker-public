package org.danielbreves.backend.controller;

import jakarta.validation.Valid;
import org.danielbreves.backend.dto.user.LoginRequestDTO;
import org.danielbreves.backend.dto.user.LoginResponseDTO;
import org.danielbreves.backend.dto.user.UserRequestDTO;
import org.danielbreves.backend.dto.user.UserResponseDTO;
import org.danielbreves.backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.time.Duration;

@RestController
@RequestMapping(value = "/auth")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class AuthController {

    private static final String GITHUB_STATE_COOKIE = "devtracker_oauth_state";

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(
            @RequestBody @Valid UserRequestDTO dto
    ) {
        UserResponseDTO response = authService.registerUser(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> loginUser(
            @RequestBody @Valid LoginRequestDTO request
    ) {
        LoginResponseDTO response = authService.loginUser(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/github")
    public ResponseEntity<Void> startGitHubAuth() {
        String state = authService.generateGitHubState();
        String authorizationUrl = authService.buildGitHubAuthorizationUrl(state);

        ResponseCookie stateCookie = ResponseCookie
                .from(GITHUB_STATE_COOKIE, state)
                .httpOnly(true)
                .secure(false)
                .path("/auth/github")
                .maxAge(Duration.ofMinutes(10))
                .sameSite("Lax")
                .build();

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, authorizationUrl)
                .header(HttpHeaders.SET_COOKIE, stateCookie.toString())
                .build();
    }

    @GetMapping("/github/callback")
    public ResponseEntity<Void> handleGitHubCallback(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String error,
            @CookieValue(name = GITHUB_STATE_COOKIE, required = false)
            String storedState
    ) {
        String redirectUrl;

        if (error != null || code == null || code.isBlank()) {
            redirectUrl = authService.buildGitHubErrorRedirectUrl(
                    "GitHub authorization was cancelled"
            );
        } else if (
                storedState == null ||
                state == null ||
                !storedState.equals(state)
        ) {
            redirectUrl = authService.buildGitHubErrorRedirectUrl(
                    "GitHub authorization state is invalid"
            );
        } else {
            try {
                redirectUrl = authService.handleGitHubCallback(code);
            } catch (RuntimeException exception) {
                redirectUrl = authService.buildGitHubErrorRedirectUrl(
                        exception.getMessage()
                );
            }
        }

        ResponseCookie clearedStateCookie = ResponseCookie
                .from(GITHUB_STATE_COOKIE, "")
                .httpOnly(true)
                .secure(false)
                .path("/auth/github")
                .maxAge(Duration.ZERO)
                .sameSite("Lax")
                .build();

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(URI.create(redirectUrl))
                .header(HttpHeaders.SET_COOKIE, clearedStateCookie.toString())
                .build();
    }
}
