package org.danielbreves.backend.service;

import org.danielbreves.backend.security.JwtService;
import org.danielbreves.backend.dto.user.LoginRequestDTO;
import org.danielbreves.backend.dto.user.LoginResponseDTO;
import org.danielbreves.backend.dto.user.UserRequestDTO;
import org.danielbreves.backend.dto.user.UserResponseDTO;
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

        System.out.println("Email recebido: [" + request.email() + "]");
        System.out.println("Senha recebida: [" + request.password() + "]");
        System.out.println("Senha banco: [" + user.getPassword() + "]");
        System.out.println("Tamanho hash: " + user.getPassword().length());

        System.out.println(
                "Teste fixo: " + passwordEncoder.matches("SUA_SENHA_AQUI", user.getPassword())
        );

        boolean passwordMatches = passwordEncoder.matches(
                request.password(),
                user.getPassword()
        );

        System.out.println("Senha bateu pelo request? " + passwordMatches);

        if (!passwordMatches) {
            throw new RuntimeException("Email ou senha inválidos");
        }

        String token = jwtService.generateToken(user.getEmail());
        System.out.println("Token gerado: " + token);

        return new LoginResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                "Login concluído",
                token
        );
    }
    }
