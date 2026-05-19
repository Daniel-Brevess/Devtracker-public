package org.danielbreves.backend.controller;

import jakarta.validation.Valid;
import org.danielbreves.backend.dto.user.*;
import org.danielbreves.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping(value = "/user")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(
            @RequestBody @Valid UserRequestDTO dto
    ) {
        UserResponseDTO response = userService.registerUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public LoginResponseDTO loginUser(
            @RequestBody LoginRequestDTO request
    ) {
        return userService.loginUser(request);
    }

    @PutMapping("/update")
    public ResponseEntity<UserUpdateResponseDTO> updateUser(
            @RequestBody @Valid UserUpdateRequestDTO requestDTO,
            Principal principal
    ) {

        String currentEmail = principal.getName();

        UserUpdateResponseDTO responseDTO =
                userService.updateUser(currentEmail, requestDTO);

        return ResponseEntity.ok(responseDTO);
    }


}
