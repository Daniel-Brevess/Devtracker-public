package org.danielbreves.backend.service;

import org.apache.logging.log4j.util.Base64Util;
import org.danielbreves.backend.dto.user.UserRequestDTO;
import org.danielbreves.backend.dto.user.UserResponseDTO;
import org.danielbreves.backend.entity.User;
import org.danielbreves.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserResponseDTO registerUser(UserRequestDTO dto) {
        User user = new User();

        user.setName(dto.name());
        user.setUsername(dto.username());
        user.setEmail(dto.email());
        Base64Util passwordEncoder = null;
        user.setPassword(passwordEncoder.encode(dto.password()));

        User savedUser = userRepository.save(user);

        return new UserResponseDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getUsername(),
                savedUser.getEmail()
        );
    }

}
