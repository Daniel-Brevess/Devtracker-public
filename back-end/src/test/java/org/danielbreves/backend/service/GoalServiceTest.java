package org.danielbreves.backend.service;

import org.danielbreves.backend.dto.goal.CreateGoalRequestDTO;
import org.danielbreves.backend.dto.goal.CreateGoalResponseDTO;
import org.danielbreves.backend.dto.goal.DeleteGoalResponseDTO;
import org.danielbreves.backend.dto.goal.GoalResponseDTO;
import org.danielbreves.backend.dto.goal.UpdateGoalRequestDTO;
import org.danielbreves.backend.dto.goal.UpdateGoalResponseDTO;
import org.danielbreves.backend.entity.Goal;
import org.danielbreves.backend.entity.User;
import org.danielbreves.backend.entity.enums.GoalDifficulty;
import org.danielbreves.backend.entity.enums.GoalStatus;
import org.danielbreves.backend.repository.GoalRepository;
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

class GoalServiceTest {

    @Test
    void createGoalUsesCurrentUserIdBeforeSaving() {
        GoalRepository goalRepository = mock(GoalRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        GoalService goalService = new GoalService(goalRepository, userRepository);

        String currentEmail = "user@test.com";
        User user = new User(1L, "User", "username", "password", currentEmail, null);
        CreateGoalRequestDTO requestDTO = new CreateGoalRequestDTO(
                "Learn Spring",
                "Build a complete API",
                GoalDifficulty.HIGH,
                GoalStatus.IN_PROGRESS
        );
        LocalDateTime createdAt = LocalDateTime.now();

        when(userRepository.findByEmail(currentEmail)).thenReturn(Optional.of(user));
        when(goalRepository.save(any(Goal.class))).thenAnswer(invocation -> {
            Goal goal = invocation.getArgument(0);
            return new Goal(
                    10L,
                    goal.getIdUser(),
                    goal.getTitle(),
                    goal.getDescription(),
                    goal.getDifficulty(),
                    goal.getStatus(),
                    createdAt
            );
        });

        CreateGoalResponseDTO responseDTO =
                goalService.createGoal(currentEmail, requestDTO);

        verify(userRepository).findByEmail(currentEmail);
        assertEquals(10L, responseDTO.id());
        assertEquals(1L, responseDTO.idUser());
        assertEquals("Learn Spring", responseDTO.title());
        assertEquals("Build a complete API", responseDTO.description());
        assertEquals(GoalDifficulty.HIGH, responseDTO.difficulty());
        assertEquals(GoalStatus.IN_PROGRESS, responseDTO.status());
        assertEquals(createdAt, responseDTO.createdAt());
    }

    @Test
    void getAllGoalsReturnsOnlyCurrentUserGoals() {
        GoalRepository goalRepository = mock(GoalRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        GoalService goalService = new GoalService(goalRepository, userRepository);

        String currentEmail = "user@test.com";
        User user = new User(1L, "User", "username", "password", currentEmail, null);
        LocalDateTime createdAt = LocalDateTime.now();
        Goal goal = new Goal(
                10L,
                1L,
                "Learn Spring",
                "Build a complete API",
                GoalDifficulty.HIGH,
                GoalStatus.TODO,
                createdAt
        );

        when(userRepository.findByEmail(currentEmail)).thenReturn(Optional.of(user));
        when(goalRepository.findAllByIdUser(1L)).thenReturn(List.of(goal));

        List<GoalResponseDTO> responseDTO =
                goalService.getAllGoals(currentEmail);

        verify(userRepository).findByEmail(currentEmail);
        verify(goalRepository).findAllByIdUser(1L);
        assertEquals(1, responseDTO.size());
        assertEquals(10L, responseDTO.get(0).id());
        assertEquals(1L, responseDTO.get(0).idUser());
        assertEquals("Learn Spring", responseDTO.get(0).title());
        assertEquals("Build a complete API", responseDTO.get(0).description());
        assertEquals(GoalDifficulty.HIGH, responseDTO.get(0).difficulty());
        assertEquals(GoalStatus.TODO, responseDTO.get(0).status());
        assertEquals(createdAt, responseDTO.get(0).createdAt());
    }

    @Test
    void updateGoalFindsGoalByIdAndCurrentUserIdBeforeSaving() {
        GoalRepository goalRepository = mock(GoalRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        GoalService goalService = new GoalService(goalRepository, userRepository);

        String currentEmail = "user@test.com";
        User user = new User(1L, "User", "username", "password", currentEmail, null);
        LocalDateTime createdAt = LocalDateTime.now();
        Goal goal = new Goal(
                10L,
                1L,
                "Learn Spring",
                "Build a complete API",
                GoalDifficulty.HIGH,
                GoalStatus.TODO,
                createdAt
        );
        UpdateGoalRequestDTO requestDTO = new UpdateGoalRequestDTO(
                "Learn Java",
                "Study clean code",
                GoalDifficulty.MEDIUM,
                GoalStatus.IN_PROGRESS
        );

        when(userRepository.findByEmail(currentEmail)).thenReturn(Optional.of(user));
        when(goalRepository.findByIdAndIdUser(10L, 1L)).thenReturn(Optional.of(goal));
        when(goalRepository.save(goal)).thenReturn(goal);

        UpdateGoalResponseDTO responseDTO =
                goalService.updateGoal(currentEmail, 10L, requestDTO);

        verify(userRepository).findByEmail(currentEmail);
        verify(goalRepository).findByIdAndIdUser(10L, 1L);
        verify(goalRepository).save(goal);
        assertEquals(10L, responseDTO.id());
        assertEquals(1L, responseDTO.idUser());
        assertEquals("Learn Java", responseDTO.title());
        assertEquals("Study clean code", responseDTO.description());
        assertEquals(GoalDifficulty.MEDIUM, responseDTO.difficulty());
        assertEquals(GoalStatus.IN_PROGRESS, responseDTO.status());
        assertEquals(createdAt, responseDTO.createdAt());
    }

    @Test
    void deleteGoalFindsGoalByIdAndCurrentUserIdBeforeDeleting() {
        GoalRepository goalRepository = mock(GoalRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        GoalService goalService = new GoalService(goalRepository, userRepository);

        String currentEmail = "user@test.com";
        User user = new User(1L, "User", "username", "password", currentEmail, null);
        Goal goal = new Goal(
                10L,
                1L,
                "Learn Spring",
                "Build a complete API",
                GoalDifficulty.HIGH,
                GoalStatus.TODO,
                LocalDateTime.now()
        );

        when(userRepository.findByEmail(currentEmail)).thenReturn(Optional.of(user));
        when(goalRepository.findByIdAndIdUser(10L, 1L)).thenReturn(Optional.of(goal));

        DeleteGoalResponseDTO responseDTO =
                goalService.deleteGoal(currentEmail, 10L);

        verify(userRepository).findByEmail(currentEmail);
        verify(goalRepository).findByIdAndIdUser(10L, 1L);
        verify(goalRepository).delete(goal);
        assertEquals("Goal deleted successfully", responseDTO.message());
    }
}
