package org.danielbreves.backend.service;

import org.danielbreves.backend.dto.user.*;
import org.danielbreves.backend.security.JwtService;
import org.danielbreves.backend.entity.User;
import org.danielbreves.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder, JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public UserResponseDTO registerUser(UserRequestDTO dto) {
        User user = new User();

        user.setName(dto.name());
        user.setUsername(dto.username());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));

        User savedUser = userRepository.save(user);

        return new UserResponseDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getUsername(),
                savedUser.getEmail()
        );
    }

    public LoginResponseDTO loginUser(LoginRequestDTO request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Email ou senha inválidos"));

        boolean passwordMatches = passwordEncoder.matches(
                request.password(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new RuntimeException("Email ou senha inválidos");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponseDTO(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail(),
                "Login concluído",
                token
        );
    }

    public UserUpdateResponseDTO updateUser(
            String currentEmail,
            UserUpdateRequestDTO requestDTO
    ) {

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

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

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

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

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

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
}
