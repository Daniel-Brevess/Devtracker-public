package org.danielbreves.backend.service;

import org.danielbreves.backend.dto.focus.CreateFocusRequestDTO;
import org.danielbreves.backend.dto.focus.CreateFocusResponseDTO;
import org.danielbreves.backend.dto.focus.DeleteFocusRequestDTO;
import org.danielbreves.backend.dto.focus.DeleteFocusResponseDTO;
import org.danielbreves.backend.dto.focus.FocusResponseDTO;
import org.danielbreves.backend.dto.focus.UpdateFocusRequestDTO;
import org.danielbreves.backend.dto.focus.UpdateFocusResponseDTO;
import org.danielbreves.backend.entity.Focus;
import org.danielbreves.backend.entity.User;
import org.danielbreves.backend.exception.NotFoundException;
import org.danielbreves.backend.exception.ValidationException;
import org.danielbreves.backend.repository.FocusRepository;
import org.danielbreves.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FocusService {

    private static final int MAX_ACTIVE_FOCUSES_PER_USER = 20;

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
                .orElseThrow(() -> new NotFoundException("User not found"));
        ensureFocusQuota(user);

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
                .orElseThrow(() -> new NotFoundException("User not found"));

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

    public UpdateFocusResponseDTO updateFocus(
            String currentEmail,
            UpdateFocusRequestDTO requestDTO
    ) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Focus focus = focusRepository.findByIdAndUser(requestDTO.id(), user)
                .orElseThrow(() -> new NotFoundException("Focus not found"));

        focus.setTitle(requestDTO.title());

        Focus updatedFocus = focusRepository.save(focus);

        return new UpdateFocusResponseDTO(
                updatedFocus.getId(),
                updatedFocus.getUser().getId(),
                updatedFocus.getTitle(),
                updatedFocus.getCreatedAt()
        );
    }

    public DeleteFocusResponseDTO deleteFocus(
            String currentEmail,
            DeleteFocusRequestDTO requestDTO
    ) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Focus focus = focusRepository.findByIdAndUser(requestDTO.id(), user)
                .orElseThrow(() -> new NotFoundException("Focus not found"));

        focusRepository.delete(focus);

        return new DeleteFocusResponseDTO("Focus deleted successfully");
    }

    private void ensureFocusQuota(User user) {
        if (focusRepository.countByUser(user) >= MAX_ACTIVE_FOCUSES_PER_USER) {
            throw new ValidationException(
                    "You can have up to 20 active focuses"
            );
        }
    }
}
