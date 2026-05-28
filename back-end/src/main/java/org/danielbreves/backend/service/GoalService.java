package org.danielbreves.backend.service;

import org.danielbreves.backend.dto.goal.CreateGoalRequestDTO;
import org.danielbreves.backend.dto.goal.CreateGoalResponseDTO;
import org.danielbreves.backend.dto.goal.DeleteGoalResponseDTO;
import org.danielbreves.backend.dto.goal.GoalResponseDTO;
import org.danielbreves.backend.dto.goal.UpdateGoalRequestDTO;
import org.danielbreves.backend.dto.goal.UpdateGoalResponseDTO;
import org.danielbreves.backend.entity.Goal;
import org.danielbreves.backend.entity.User;
import org.danielbreves.backend.exception.NotFoundException;
import org.danielbreves.backend.exception.ValidationException;
import org.danielbreves.backend.repository.GoalRepository;
import org.danielbreves.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoalService {

    private static final int MAX_ACTIVE_GOALS_PER_USER = 30;

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public GoalService(
            GoalRepository goalRepository,
            UserRepository userRepository
    ) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }

    public CreateGoalResponseDTO createGoal(
            String currentEmail,
            CreateGoalRequestDTO requestDTO
    ) {
        User user = getCurrentUser(currentEmail);
        ensureGoalQuota(user);

        Goal goal = new Goal(
                null,
                user.getId(),
                requestDTO.title(),
                requestDTO.description(),
                requestDTO.difficulty(),
                requestDTO.status(),
                null
        );

        Goal savedGoal = goalRepository.save(goal);

        return toCreateGoalResponseDTO(savedGoal);
    }

    public List<GoalResponseDTO> getAllGoals(String currentEmail) {
        User user = getCurrentUser(currentEmail);

        return goalRepository.findAllByIdUser(user.getId())
                .stream()
                .map(this::toGoalResponseDTO)
                .toList();
    }

    public UpdateGoalResponseDTO updateGoal(
            String currentEmail,
            Long goalId,
            UpdateGoalRequestDTO requestDTO
    ) {
        User user = getCurrentUser(currentEmail);

        Goal goal = goalRepository.findByIdAndIdUser(goalId, user.getId())
                .orElseThrow(() -> new NotFoundException("Goal not found"));

        goal.setTitle(requestDTO.title());
        goal.setDescription(requestDTO.description());
        goal.setDifficulty(requestDTO.difficulty());
        goal.setStatus(requestDTO.status());

        Goal updatedGoal = goalRepository.save(goal);

        return toUpdateGoalResponseDTO(updatedGoal);
    }

    public DeleteGoalResponseDTO deleteGoal(
            String currentEmail,
            Long goalId
    ) {
        User user = getCurrentUser(currentEmail);

        Goal goal = goalRepository.findByIdAndIdUser(goalId, user.getId())
                .orElseThrow(() -> new NotFoundException("Goal not found"));

        goalRepository.delete(goal);

        return new DeleteGoalResponseDTO("Goal deleted successfully");
    }

    private User getCurrentUser(String currentEmail) {
        return userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    private CreateGoalResponseDTO toCreateGoalResponseDTO(Goal goal) {
        return new CreateGoalResponseDTO(
                goal.getId(),
                goal.getIdUser(),
                goal.getTitle(),
                goal.getDescription(),
                goal.getDifficulty(),
                goal.getStatus(),
                goal.getCreatedAt()
        );
    }

    private GoalResponseDTO toGoalResponseDTO(Goal goal) {
        return new GoalResponseDTO(
                goal.getId(),
                goal.getIdUser(),
                goal.getTitle(),
                goal.getDescription(),
                goal.getDifficulty(),
                goal.getStatus(),
                goal.getCreatedAt()
        );
    }

    private UpdateGoalResponseDTO toUpdateGoalResponseDTO(Goal goal) {
        return new UpdateGoalResponseDTO(
                goal.getId(),
                goal.getIdUser(),
                goal.getTitle(),
                goal.getDescription(),
                goal.getDifficulty(),
                goal.getStatus(),
                goal.getCreatedAt()
        );
    }

    private void ensureGoalQuota(User user) {
        if (goalRepository.countByIdUser(user.getId()) >= MAX_ACTIVE_GOALS_PER_USER) {
            throw new ValidationException(
                    "You can have up to 30 active goals"
            );
        }
    }
}
