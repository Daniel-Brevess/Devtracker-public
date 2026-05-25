package org.danielbreves.backend.service;

import org.danielbreves.backend.dto.session.CreateSessionRequestDTO;
import org.danielbreves.backend.dto.session.CreateSessionResponseDTO;
import org.danielbreves.backend.dto.session.SessionResponseDTO;
import org.danielbreves.backend.entity.Session;
import org.danielbreves.backend.entity.User;
import org.danielbreves.backend.entity.enums.SessionType;
import org.danielbreves.backend.repository.SessionRepository;
import org.danielbreves.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SessionServiceTest {

    @Test
    void createSessionUsesCurrentUserBeforeSaving() {
        SessionRepository sessionRepository = mock(SessionRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        SessionService sessionService =
                new SessionService(sessionRepository, userRepository);

        String currentEmail = "user@test.com";
        User user = new User(1L, "User", "username", "password", currentEmail, null);
        CreateSessionRequestDTO requestDTO = new CreateSessionRequestDTO(
                SessionType.DEEP_WORK,
                1500
        );
        LocalDateTime createdAt = LocalDateTime.now();

        when(userRepository.findByEmail(currentEmail)).thenReturn(Optional.of(user));
        when(sessionRepository.save(any(Session.class))).thenAnswer(invocation -> {
            Session session = invocation.getArgument(0);

            return new Session(
                    10L,
                    session.getUser(),
                    session.getType(),
                    session.getDurationSeconds(),
                    createdAt
            );
        });

        CreateSessionResponseDTO responseDTO =
                sessionService.createSession(currentEmail, requestDTO);

        verify(userRepository).findByEmail(currentEmail);
        assertEquals(10L, responseDTO.id());
        assertEquals(1L, responseDTO.idUser());
        assertEquals(SessionType.DEEP_WORK, responseDTO.type());
        assertEquals(1500, responseDTO.duration());
        assertEquals(createdAt, responseDTO.createdAt());
    }

    @Test
    void getAllSessionsReturnsCurrentUserSessions() {
        SessionRepository sessionRepository = mock(SessionRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        SessionService sessionService =
                new SessionService(sessionRepository, userRepository);

        String currentEmail = "user@test.com";
        User user = new User(1L, "User", "username", "password", currentEmail, null);
        LocalDateTime createdAt = LocalDateTime.now();
        Session session = new Session(
                10L,
                user,
                SessionType.FOCUS,
                900,
                createdAt
        );

        when(userRepository.findByEmail(currentEmail)).thenReturn(Optional.of(user));
        when(sessionRepository.findAllByUser(user)).thenReturn(List.of(session));

        List<SessionResponseDTO> responseDTO =
                sessionService.getAllSessions(currentEmail);

        verify(userRepository).findByEmail(currentEmail);
        verify(sessionRepository).findAllByUser(user);
        assertEquals(1, responseDTO.size());
        assertEquals(10L, responseDTO.get(0).id());
        assertEquals(1L, responseDTO.get(0).idUser());
        assertEquals(SessionType.FOCUS, responseDTO.get(0).type());
        assertEquals(900, responseDTO.get(0).duration());
        assertEquals(createdAt, responseDTO.get(0).createdAt());
    }
}
