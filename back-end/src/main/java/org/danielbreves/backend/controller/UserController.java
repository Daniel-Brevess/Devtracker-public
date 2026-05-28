package org.danielbreves.backend.controller;

import jakarta.validation.Valid;
import org.danielbreves.backend.dto.user.UserDeleteRequestDTO;
import org.danielbreves.backend.dto.user.UserDeleteResponseDTO;
import org.danielbreves.backend.dto.user.UserPasswordUpdateRequestDTO;
import org.danielbreves.backend.dto.user.UserPasswordUpdateResponseDTO;
import org.danielbreves.backend.dto.user.UserResponseDTO;
import org.danielbreves.backend.dto.user.UserUpdateRequestDTO;
import org.danielbreves.backend.dto.user.UserUpdateResponseDTO;
import org.danielbreves.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping(value = "/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(Principal principal) {
        UserResponseDTO responseDTO =
                userService.getCurrentUser(principal.getName());

        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/update")
    public ResponseEntity<UserUpdateResponseDTO> updateUser(
            @RequestBody @Valid UserUpdateRequestDTO requestDTO,
            Principal principal
    ) {
        UserUpdateResponseDTO responseDTO =
                userService.updateUser(principal.getName(), requestDTO);

        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/update-password")
    public ResponseEntity<UserPasswordUpdateResponseDTO> updatePassword(
            @RequestBody @Valid UserPasswordUpdateRequestDTO requestDTO,
            Principal principal
    ) {
        UserPasswordUpdateResponseDTO responseDTO =
                userService.updatePassword(principal.getName(), requestDTO);

        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<UserDeleteResponseDTO> deleteUser(
            @RequestBody @Valid UserDeleteRequestDTO requestDTO,
            Principal principal
    ) {
        UserDeleteResponseDTO responseDTO =
                userService.deleteUser(principal.getName(), requestDTO);

        return ResponseEntity.ok(responseDTO);
    }
}
