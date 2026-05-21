package org.danielbreves.backend.service;

import org.danielbreves.backend.dto.focus.CreateFocusRequestDTO;
import org.danielbreves.backend.dto.focus.CreateFocusResponseDTO;
import org.danielbreves.backend.dto.focus.FocusResponseDTO;
import org.danielbreves.backend.entity.Focus;
import org.danielbreves.backend.entity.User;
import org.danielbreves.backend.repository.FocusRepository;
import org.danielbreves.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FocusService {

    private final FocusRepository focusRepository;
    private final UserRepository userRepository;

    public FocusService(FocusRepository focusRepository, UserRepository userRepository) {
        this.focusRepository = focusRepository;
        this.userRepository = userRepository;
    }

    public CreateFocusResponseDTO createFocus(
            String currentEmail,
            CreateFocusRequestDTO requestDTO
    ) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Focus focus = new Focus(
                null,
                user,
                requestDTO.title(),
                null
        );

        Focus savedFocus = focusRepository.save(focus);

        return new CreateFocusResponseDTO(
                savedFocus.getId(),
                savedFocus.getUser().getId(),
                savedFocus.getTitle(),
                savedFocus.getCreatedAt()
        );
    }

    public List<FocusResponseDTO> getAllFocuses(String currentEmail) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return focusRepository.findAllByUser(user)
                .stream()
                .map(focus -> new FocusResponseDTO(
                        focus.getId(),
                        focus.getUser().getId(),
                        focus.getTitle(),
                        focus.getCreatedAt()
                ))
                .toList();
    }
}
