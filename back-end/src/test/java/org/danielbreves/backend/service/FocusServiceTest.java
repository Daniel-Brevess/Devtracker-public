package org.danielbreves.backend.service;

import org.danielbreves.backend.dto.focus.CreateFocusRequestDTO;
import org.danielbreves.backend.dto.focus.CreateFocusResponseDTO;
import org.danielbreves.backend.entity.Focus;
import org.danielbreves.backend.entity.User;
import org.danielbreves.backend.repository.FocusRepository;
import org.danielbreves.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class FocusServiceTest {

    @Test
    void createFocusFindsUserByCurrentEmailAndSavesFocus() {
        FocusRepository focusRepository = mock(FocusRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        FocusService focusService = new FocusService(focusRepository, userRepository);

        String currentEmail = "user@test.com";
        User user = new User(1L, "User", "username", "password", currentEmail, null);
        CreateFocusRequestDTO requestDTO = new CreateFocusRequestDTO("Study");
        LocalDateTime createdAt = LocalDateTime.now();

        when(userRepository.findByEmail(currentEmail)).thenReturn(Optional.of(user));
        when(focusRepository.save(any(Focus.class))).thenAnswer(invocation -> {
            Focus focus = invocation.getArgument(0);
            return new Focus(10L, focus.getUser(), focus.getTitle(), createdAt);
        });

        CreateFocusResponseDTO responseDTO =
                focusService.createFocus(currentEmail, requestDTO);

        verify(userRepository).findByEmail(currentEmail);
        assertEquals(10L, responseDTO.id());
        assertEquals(1L, responseDTO.idUser());
        assertEquals("Study", responseDTO.title());
        assertEquals(createdAt, responseDTO.createdAt());
    }
}
