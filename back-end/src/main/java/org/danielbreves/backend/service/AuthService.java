package org.danielbreves.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.danielbreves.backend.dto.auth.GitHubEmailDTO;
import org.danielbreves.backend.dto.auth.GitHubUserDTO;
import org.danielbreves.backend.dto.user.LoginRequestDTO;
import org.danielbreves.backend.dto.user.LoginResponseDTO;
import org.danielbreves.backend.dto.user.UserRequestDTO;
import org.danielbreves.backend.dto.user.UserResponseDTO;
import org.danielbreves.backend.entity.User;
import org.danielbreves.backend.entity.enums.AuthProvider;
import org.danielbreves.backend.repository.UserRepository;
import org.danielbreves.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    private static final String GITHUB_AUTHORIZE_URL =
            "https://github.com/login/oauth/authorize";
    private static final String GITHUB_ACCESS_TOKEN_URL =
            "https://github.com/login/oauth/access_token";
    private static final String GITHUB_USER_URL =
            "https://api.github.com/user";
    private static final String GITHUB_EMAILS_URL =
            "https://api.github.com/user/emails";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Value("${github.oauth.client-id}")
    private String githubClientId;

    @Value("${github.oauth.client-secret}")
    private String githubClientSecret;

    @Value("${github.oauth.redirect-uri}")
    private String githubRedirectUri;

    @Value("${app.frontend.auth-callback-url}")
    private String frontendAuthCallbackUrl;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newHttpClient();
    }

    public UserResponseDTO registerUser(UserRequestDTO dto) {
        User user = new User();

        user.setName(dto.name());
        user.setUsername(dto.username());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setAuthProvider(AuthProvider.LOCAL);

        User savedUser = userRepository.save(user);

        return new UserResponseDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getGithubUsername(),
                savedUser.getAvatarUrl(),
                savedUser.getAuthProvider()
        );
    }

    public LoginResponseDTO loginUser(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Email ou senha invalidos"));

        if (user.getPassword() == null || !isLocalUser(user)) {
            throw new RuntimeException("Email ou senha invalidos");
        }

        boolean passwordMatches = passwordEncoder.matches(
                request.password(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new RuntimeException("Email ou senha invalidos");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponseDTO(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail(),
                user.getGithubUsername(),
                user.getAvatarUrl(),
                user.getAuthProvider(),
                "Login concluido",
                token
        );
    }

    public String generateGitHubState() {
        return UUID.randomUUID().toString();
    }

    public String buildGitHubAuthorizationUrl(String state) {
        validateGitHubOAuthConfiguration();

        return UriComponentsBuilder
                .fromUriString(GITHUB_AUTHORIZE_URL)
                .queryParam("client_id", githubClientId)
                .queryParam("redirect_uri", githubRedirectUri)
                .queryParam("scope", "read:user user:email")
                .queryParam("state", state)
                .build()
                .toUriString();
    }

    public String handleGitHubCallback(String code) {
        validateGitHubOAuthConfiguration();

        String accessToken = requestGitHubAccessToken(code);
        GitHubUserDTO gitHubUser = requestGitHubUser(accessToken);
        String email = resolveGitHubEmail(gitHubUser, accessToken);

        User user = userRepository.findByGithubId(String.valueOf(gitHubUser.id()))
                .orElseGet(() -> createGitHubUser(gitHubUser, email));

        String token = jwtService.generateToken(user.getEmail());

        return UriComponentsBuilder
                .fromUriString(frontendAuthCallbackUrl)
                .queryParam("token", token)
                .build()
                .encode()
                .toUriString();
    }

    public String buildGitHubErrorRedirectUrl(String message) {
        return UriComponentsBuilder
                .fromUriString(frontendAuthCallbackUrl)
                .queryParam("error", message)
                .build()
                .encode()
                .toUriString();
    }

    private String requestGitHubAccessToken(String code) {
        String form = "client_id=" + encode(githubClientId) +
                "&client_secret=" + encode(githubClientSecret) +
                "&code=" + encode(code) +
                "&redirect_uri=" + encode(githubRedirectUri);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(GITHUB_ACCESS_TOKEN_URL))
                .header("Accept", "application/json")
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(form))
                .build();

        JsonNode response = sendJsonRequest(request);
        JsonNode accessTokenNode = response.get("access_token");

        if (accessTokenNode == null || accessTokenNode.asText().isBlank()) {
            throw new RuntimeException("GitHub access token was not received");
        }

        return accessTokenNode.asText();
    }

    private GitHubUserDTO requestGitHubUser(String accessToken) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(GITHUB_USER_URL))
                .header("Accept", "application/vnd.github+json")
                .header("Authorization", "Bearer " + accessToken)
                .GET()
                .build();

        try {
            JsonNode response = sendJsonRequest(request);

            return objectMapper.treeToValue(response, GitHubUserDTO.class);
        } catch (IOException exception) {
            throw new RuntimeException("Could not read GitHub user data");
        }
    }

    private String resolveGitHubEmail(
            GitHubUserDTO gitHubUser,
            String accessToken
    ) {
        if (gitHubUser.email() != null && !gitHubUser.email().isBlank()) {
            return gitHubUser.email();
        }

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(GITHUB_EMAILS_URL))
                .header("Accept", "application/vnd.github+json")
                .header("Authorization", "Bearer " + accessToken)
                .GET()
                .build();

        try {
            JsonNode response = sendJsonRequest(request);
            List<GitHubEmailDTO> emails = objectMapper.readValue(
                    response.traverse(),
                    new TypeReference<List<GitHubEmailDTO>>() {}
            );

            return emails.stream()
                    .filter(email -> Boolean.TRUE.equals(email.verified()))
                    .filter(email -> Boolean.TRUE.equals(email.primary()))
                    .map(GitHubEmailDTO::email)
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException(
                            "GitHub account does not have a verified primary email"
                    ));
        } catch (IOException exception) {
            throw new RuntimeException("Could not read GitHub email data");
        }
    }

    private User createGitHubUser(GitHubUserDTO gitHubUser, String email) {
        userRepository.findByEmail(email)
                .ifPresent(existingUser -> {
                    throw new RuntimeException(
                            "Email already exists. Account linking is not available yet"
                    );
                });

        User user = new User();
        String gitHubId = String.valueOf(gitHubUser.id());
        String username = gitHubUser.login() + "-" + gitHubId;

        user.setName(resolveGitHubName(gitHubUser));
        user.setUsername(username);
        user.setEmail(email);
        user.setGithubId(gitHubId);
        user.setGithubUsername(gitHubUser.login());
        user.setAvatarUrl(gitHubUser.avatarUrl());
        user.setAuthProvider(AuthProvider.GITHUB);

        return userRepository.save(user);
    }

    private String resolveGitHubName(GitHubUserDTO gitHubUser) {
        if (gitHubUser.name() != null && !gitHubUser.name().isBlank()) {
            return gitHubUser.name();
        }

        return gitHubUser.login();
    }

    private boolean isLocalUser(User user) {
        return user.getAuthProvider() == null ||
                user.getAuthProvider() == AuthProvider.LOCAL;
    }

    private JsonNode sendJsonRequest(HttpRequest request) {
        try {
            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new RuntimeException("GitHub request failed");
            }

            return objectMapper.readTree(response.body());
        } catch (IOException exception) {
            throw new RuntimeException("Could not communicate with GitHub");
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("GitHub request was interrupted");
        }
    }

    private void validateGitHubOAuthConfiguration() {
        if (
                githubClientId == null ||
                githubClientId.isBlank() ||
                githubClientSecret == null ||
                githubClientSecret.isBlank()
        ) {
            throw new RuntimeException("GitHub OAuth is not configured");
        }
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
