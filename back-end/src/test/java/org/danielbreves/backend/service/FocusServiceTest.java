package org.danielbreves.backend.service;

import org.danielbreves.backend.dto.focus.CreateFocusRequestDTO;
import org.danielbreves.backend.dto.focus.CreateFocusResponseDTO;
import org.danielbreves.backend.dto.focus.FocusResponseDTO;
import org.danielbreves.backend.dto.focus.UpdateFocusRequestDTO;
import org.danielbreves.backend.dto.focus.UpdateFocusResponseDTO;
import org.danielbreves.backend.entity.Focus;
import org.danielbreves.backend.entity.User;
import org.danielbreves.backend.repository.FocusRepository;
import org.danielbreves.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.util.List;
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

    @Test
    void getAllFocusesFindsUserByCurrentEmailAndReturnsOnlyUserFocuses() {
        FocusRepository focusRepository = mock(FocusRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        FocusService focusService = new FocusService(focusRepository, userRepository);

        String currentEmail = "user@test.com";
        User user = new User(1L, "User", "username", "password", currentEmail, null);
        LocalDateTime createdAt = LocalDateTime.now();
        Focus focus = new Focus(10L, user, "Study", createdAt);

        when(userRepository.findByEmail(currentEmail)).thenReturn(Optional.of(user));
        when(focusRepository.findAllByUser(user)).thenReturn(List.of(focus));

        List<FocusResponseDTO> responseDTO =
                focusService.getAllFocuses(currentEmail);

        verify(userRepository).findByEmail(currentEmail);
        verify(focusRepository).findAllByUser(user);
        assertEquals(1, responseDTO.size());
        assertEquals(10L, responseDTO.get(0).id());
        assertEquals(1L, responseDTO.get(0).idUser());
        assertEquals("Study", responseDTO.get(0).title());
        assertEquals(createdAt, responseDTO.get(0).createdAt());
    }

    @Test
    void updateFocusFindsFocusByIdAndCurrentUserBeforeSaving() {
        FocusRepository focusRepository = mock(FocusRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        FocusService focusService = new FocusService(focusRepository, userRepository);

        String currentEmail = "user@test.com";
        User user = new User(1L, "User", "username", "password", currentEmail, null);
        LocalDateTime createdAt = LocalDateTime.now();
        Focus focus = new Focus(10L, user, "Study", createdAt);
        UpdateFocusRequestDTO requestDTO = new UpdateFocusRequestDTO(10L, "Updated study");

        when(userRepository.findByEmail(currentEmail)).thenReturn(Optional.of(user));
        when(focusRepository.findByIdAndUser(10L, user)).thenReturn(Optional.of(focus));
        when(focusRepository.save(focus)).thenReturn(focus);

        UpdateFocusResponseDTO responseDTO =
                focusService.updateFocus(currentEmail, requestDTO);

        verify(userRepository).findByEmail(currentEmail);
        verify(focusRepository).findByIdAndUser(10L, user);
        verify(focusRepository).save(focus);
        assertEquals(10L, responseDTO.id());
        assertEquals(1L, responseDTO.idUser());
        assertEquals("Updated study", responseDTO.title());
        assertEquals(createdAt, responseDTO.createdAt());
    }
}
