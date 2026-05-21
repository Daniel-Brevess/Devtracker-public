package org.danielbreves.backend.controller;

import jakarta.validation.Valid;
import org.danielbreves.backend.dto.focus.CreateFocusRequestDTO;
import org.danielbreves.backend.dto.focus.CreateFocusResponseDTO;
import org.danielbreves.backend.service.FocusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping(value = "/focus")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class FocusController {

    @Autowired
    private FocusService focusService;

    @PostMapping("/create")
    public ResponseEntity<CreateFocusResponseDTO> createFocus(
            @RequestBody @Valid CreateFocusRequestDTO requestDTO,
            Principal principal
    ) {
        CreateFocusResponseDTO responseDTO =
                focusService.createFocus(principal.getName(), requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }
}
