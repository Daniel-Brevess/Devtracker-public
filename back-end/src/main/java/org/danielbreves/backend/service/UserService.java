package org.danielbreves.backend.service;

import org.danielbreves.backend.dto.user.UserDeleteRequestDTO;
import org.danielbreves.backend.dto.user.UserDeleteResponseDTO;
import org.danielbreves.backend.dto.user.UserPasswordUpdateRequestDTO;
import org.danielbreves.backend.dto.user.UserPasswordUpdateResponseDTO;
import org.danielbreves.backend.dto.user.UserResponseDTO;
import org.danielbreves.backend.dto.user.UserUpdateRequestDTO;
import org.danielbreves.backend.dto.user.UserUpdateResponseDTO;
import org.danielbreves.backend.entity.User;
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
                user.getEmail()
        );
    }

    public UserUpdateResponseDTO updateUser(
            String currentEmail,
            UserUpdateRequestDTO requestDTO
    ) {
        User user = findCurrentUser(currentEmail);

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

        boolean passwordMatches = passwordEncoder.matches(
                requestDTO.currentPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new RuntimeException("Current password is invalid");
        }

        user.setPassword(passwordEncoder.encode(requestDTO.newPassword()));
        userRepository.save(user);

        return new UserPasswordUpdateResponseDTO("Password updated successfully");
    }

    public UserDeleteResponseDTO deleteUser(
            String currentEmail,
            UserDeleteRequestDTO requestDTO
    ) {
        User user = findCurrentUser(currentEmail);

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
}
