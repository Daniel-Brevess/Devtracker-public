package org.danielbreves.backend.service;

import org.danielbreves.backend.dto.task.CreateTaskRequestDTO;
import org.danielbreves.backend.dto.task.CreateTaskResponseDTO;
import org.danielbreves.backend.entity.Focus;
import org.danielbreves.backend.entity.Task;
import org.danielbreves.backend.entity.User;
import org.danielbreves.backend.repository.FocusRepository;
import org.danielbreves.backend.repository.TaskRepository;
import org.danielbreves.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final FocusRepository focusRepository;
    private final UserRepository userRepository;

    public TaskService(
            TaskRepository taskRepository,
            FocusRepository focusRepository,
            UserRepository userRepository
    ) {
        this.taskRepository = taskRepository;
        this.focusRepository = focusRepository;
        this.userRepository = userRepository;
    }

    public CreateTaskResponseDTO createTask(
            String currentEmail,
            Long focusId,
            CreateTaskRequestDTO requestDTO
    ) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Focus focus = focusRepository.findByIdAndUser(focusId, user)
                .orElseThrow(() -> new RuntimeException("Focus not found"));

        Task task = new Task(
                null,
                focus,
                requestDTO.title(),
                requestDTO.description(),
                requestDTO.priority(),
                null,
                null
        );

        Task savedTask = taskRepository.save(task);

        return new CreateTaskResponseDTO(
                savedTask.getId(),
                savedTask.getFocus().getId(),
                savedTask.getTitle(),
                savedTask.getDescription(),
                savedTask.getPriority(),
                savedTask.getStatus(),
                savedTask.getCreatedAt()
        );
    }
}
