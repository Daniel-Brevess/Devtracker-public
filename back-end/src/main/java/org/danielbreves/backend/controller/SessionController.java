package org.danielbreves.backend.controller;

import jakarta.validation.Valid;
import org.danielbreves.backend.dto.session.CreateSessionRequestDTO;
import org.danielbreves.backend.dto.session.CreateSessionResponseDTO;
import org.danielbreves.backend.dto.session.SessionResponseDTO;
import org.danielbreves.backend.service.SessionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping(value = "/session")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping("/create")
    public ResponseEntity<CreateSessionResponseDTO> createSession(
            @RequestBody @Valid CreateSessionRequestDTO requestDTO,
            Principal principal
    ) {
        CreateSessionResponseDTO responseDTO =
                sessionService.createSession(principal.getName(), requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping("/all")
    public ResponseEntity<List<SessionResponseDTO>> getAllSessions(
            Principal principal
    ) {
        List<SessionResponseDTO> responseDTO =
                sessionService.getAllSessions(principal.getName());

        return ResponseEntity.ok(responseDTO);
    }
}
