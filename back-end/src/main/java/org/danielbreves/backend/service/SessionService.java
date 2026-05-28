package org.danielbreves.backend.service;

import org.danielbreves.backend.dto.session.CreateSessionRequestDTO;
import org.danielbreves.backend.dto.session.CreateSessionResponseDTO;
import org.danielbreves.backend.dto.session.SessionResponseDTO;
import org.danielbreves.backend.entity.Session;
import org.danielbreves.backend.entity.User;
import org.danielbreves.backend.exception.NotFoundException;
import org.danielbreves.backend.repository.SessionRepository;
import org.danielbreves.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;

    public SessionService(
            SessionRepository sessionRepository,
            UserRepository userRepository
    ) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }

    public CreateSessionResponseDTO createSession(
            String currentEmail,
            CreateSessionRequestDTO requestDTO
    ) {
        User user = getCurrentUser(currentEmail);

        Session session = new Session(
                null,
                user,
                requestDTO.type(),
                requestDTO.duration(),
                null
        );

        Session savedSession = sessionRepository.save(session);

        return toCreateSessionResponseDTO(savedSession);
    }

    public List<SessionResponseDTO> getAllSessions(String currentEmail) {
        User user = getCurrentUser(currentEmail);

        return sessionRepository.findAllByUser(user)
                .stream()
                .map(this::toSessionResponseDTO)
                .toList();
    }

    private User getCurrentUser(String currentEmail) {
        return userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    private CreateSessionResponseDTO toCreateSessionResponseDTO(
            Session session
    ) {
        return new CreateSessionResponseDTO(
                session.getId(),
                session.getUser().getId(),
                session.getType(),
                session.getDurationSeconds(),
                session.getCreatedAt()
        );
    }

    private SessionResponseDTO toSessionResponseDTO(Session session) {
        return new SessionResponseDTO(
                session.getId(),
                session.getUser().getId(),
                session.getType(),
                session.getDurationSeconds(),
                session.getCreatedAt()
        );
    }
}
