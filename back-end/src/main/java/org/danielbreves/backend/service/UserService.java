package org.danielbreves.backend.service;

import org.danielbreves.backend.dto.user.UserDeleteRequestDTO;
import org.danielbreves.backend.dto.user.UserDeleteResponseDTO;
import org.danielbreves.backend.dto.user.UserPasswordUpdateRequestDTO;
import org.danielbreves.backend.dto.user.UserPasswordUpdateResponseDTO;
import org.danielbreves.backend.dto.user.UserResponseDTO;
import org.danielbreves.backend.dto.user.UserUpdateRequestDTO;
import org.danielbreves.backend.dto.user.UserUpdateResponseDTO;
import org.danielbreves.backend.entity.User;
import org.danielbreves.backend.entity.enums.AuthProvider;
import org.danielbreves.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDTO getCurrentUser(String currentEmail) {
        User user = findCurrentUser(currentEmail);

        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail(),
                user.getGithubUsername(),
                user.getAvatarUrl(),
                user.getAuthProvider()
        );
    }

    public UserUpdateResponseDTO updateUser(
            String currentEmail,
            UserUpdateRequestDTO requestDTO
    ) {
        User user = findCurrentUser(currentEmail);
        ensureLocalAccount(user, "GitHub accounts cannot be updated in DevTracker. Update your profile on GitHub.");

        user.setName(requestDTO.name());
        user.setUsername(requestDTO.username());
        user.setEmail(requestDTO.email());

        User updatedUser = userRepository.save(user);

        return new UserUpdateResponseDTO(
                updatedUser.getName(),
                updatedUser.getUsername(),
                updatedUser.getEmail()
        );
    }

    public UserPasswordUpdateResponseDTO updatePassword(
            String currentEmail,
            UserPasswordUpdateRequestDTO requestDTO
    ) {
        User user = findCurrentUser(currentEmail);
        ensureLocalAccount(user, "GitHub accounts do not use a local DevTracker password.");

        if (isBlank(user.getPassword())) {
            throw new RuntimeException("Local password is not available for this account");
        }

        boolean passwordMatches = passwordEncoder.matches(
                requestDTO.currentPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new RuntimeException("Current password is invalid");
        }

        user.setPassword(passwordEncoder.encode(requestDTO.newPassword()));
        user.setTokenVersion(nextTokenVersion(user));
        userRepository.save(user);

        return new UserPasswordUpdateResponseDTO("Password updated successfully");
    }

    public UserDeleteResponseDTO deleteUser(
            String currentEmail,
            UserDeleteRequestDTO requestDTO
    ) {
        User user = findCurrentUser(currentEmail);

        if (isGitHubAccount(user)) {
            validateGitHubDeleteConfirmation(user, requestDTO);
            userRepository.delete(user);

            return new UserDeleteResponseDTO("Account deleted successfully");
        }

        if (isBlank(requestDTO.password())) {
            throw new RuntimeException("Password is required");
        }

        boolean passwordMatches = passwordEncoder.matches(
                requestDTO.password(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new RuntimeException("Password is invalid");
        }

        userRepository.delete(user);

        return new UserDeleteResponseDTO("Account deleted successfully");
    }

    private User findCurrentUser(String currentEmail) {
        return userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void ensureLocalAccount(User user, String message) {
        if (isGitHubAccount(user)) {
            throw new RuntimeException(message);
        }
    }

    private boolean isGitHubAccount(User user) {
        return user.getAuthProvider() == AuthProvider.GITHUB;
    }

    private void validateGitHubDeleteConfirmation(
            User user,
            UserDeleteRequestDTO requestDTO
    ) {
        if (isBlank(requestDTO.confirmationEmail())) {
            throw new RuntimeException("Confirmation email is required for GitHub accounts");
        }

        if (!requestDTO.confirmationEmail().trim().equalsIgnoreCase(user.getEmail())) {
            throw new RuntimeException("Confirmation email does not match this GitHub account");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private Long nextTokenVersion(User user) {
        Long currentTokenVersion = user.getTokenVersion();

        return currentTokenVersion == null ? 1L : currentTokenVersion + 1L;
    }
}
