package org.danielbreves.backend.controller;

import jakarta.validation.Valid;
import org.danielbreves.backend.dto.focus.CreateFocusRequestDTO;
import org.danielbreves.backend.dto.focus.CreateFocusResponseDTO;
import org.danielbreves.backend.dto.focus.DeleteFocusRequestDTO;
import org.danielbreves.backend.dto.focus.DeleteFocusResponseDTO;
import org.danielbreves.backend.dto.focus.FocusResponseDTO;
import org.danielbreves.backend.dto.focus.UpdateFocusRequestDTO;
import org.danielbreves.backend.dto.focus.UpdateFocusResponseDTO;
import org.danielbreves.backend.service.FocusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

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

    @GetMapping("/all")
    public ResponseEntity<List<FocusResponseDTO>> getAllFocuses(
            Principal principal
    ) {
        List<FocusResponseDTO> responseDTO =
                focusService.getAllFocuses(principal.getName());

        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/update")
    public ResponseEntity<UpdateFocusResponseDTO> updateFocus(
            @RequestBody @Valid UpdateFocusRequestDTO requestDTO,
            Principal principal
    ) {
        UpdateFocusResponseDTO responseDTO =
                focusService.updateFocus(principal.getName(), requestDTO);

        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<DeleteFocusResponseDTO> deleteFocus(
            @RequestBody @Valid DeleteFocusRequestDTO requestDTO,
            Principal principal
    ) {
        DeleteFocusResponseDTO responseDTO =
                focusService.deleteFocus(principal.getName(), requestDTO);

        return ResponseEntity.ok(responseDTO);
    }
}
