package org.danielbreves.backend.service;

import org.danielbreves.backend.dto.task.CreateTaskRequestDTO;
import org.danielbreves.backend.dto.task.CreateTaskResponseDTO;
import org.danielbreves.backend.dto.task.DeleteTaskResponseDTO;
import org.danielbreves.backend.dto.task.TaskResponseDTO;
import org.danielbreves.backend.dto.task.ToggleTaskStatusResponseDTO;
import org.danielbreves.backend.dto.task.UpdateTaskRequestDTO;
import org.danielbreves.backend.dto.task.UpdateTaskResponseDTO;
import org.danielbreves.backend.entity.Focus;
import org.danielbreves.backend.entity.Task;
import org.danielbreves.backend.entity.User;
import org.danielbreves.backend.exception.NotFoundException;
import org.danielbreves.backend.exception.ValidationException;
import org.danielbreves.backend.repository.FocusRepository;
import org.danielbreves.backend.repository.TaskRepository;
import org.danielbreves.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private static final int MAX_ACTIVE_TASKS_PER_FOCUS = 25;

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
                .orElseThrow(() -> new NotFoundException("User not found"));

        Focus focus = focusRepository.findByIdAndUser(focusId, user)
                .orElseThrow(() -> new NotFoundException("Focus not found"));
        ensureTaskQuota(focus);

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

    public List<TaskResponseDTO> getTasksByFocus(String currentEmail, Long focusId) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Focus focus = focusRepository.findByIdAndUser(focusId, user)
                .orElseThrow(() -> new NotFoundException("Focus not found"));

        return taskRepository.findAllByFocus(focus)
                .stream()
                .map(task -> new TaskResponseDTO(
                        task.getId(),
                        task.getFocus().getId(),
                        task.getTitle(),
                        task.getDescription(),
                        task.getPriority(),
                        task.getStatus(),
                        task.getCreatedAt()
                ))
                .toList();
    }

    public UpdateTaskResponseDTO updateTask(
            String currentEmail,
            Long focusId,
            Long taskId,
            UpdateTaskRequestDTO requestDTO
    ) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Focus focus = focusRepository.findByIdAndUser(focusId, user)
                .orElseThrow(() -> new NotFoundException("Focus not found"));

        Task task = taskRepository.findByIdAndFocus(taskId, focus)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        task.setTitle(requestDTO.title());
        task.setDescription(requestDTO.description());
        task.setPriority(requestDTO.priority());

        Task updatedTask = taskRepository.save(task);

        return new UpdateTaskResponseDTO(
                updatedTask.getId(),
                updatedTask.getFocus().getId(),
                updatedTask.getTitle(),
                updatedTask.getDescription(),
                updatedTask.getPriority(),
                updatedTask.getStatus(),
                updatedTask.getCreatedAt()
        );
    }

    public DeleteTaskResponseDTO deleteTask(
            String currentEmail,
            Long focusId,
            Long taskId
    ) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Focus focus = focusRepository.findByIdAndUser(focusId, user)
                .orElseThrow(() -> new NotFoundException("Focus not found"));

        Task task = taskRepository.findByIdAndFocus(taskId, focus)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        taskRepository.delete(task);

        return new DeleteTaskResponseDTO("Task deleted successfully");
    }

    public ToggleTaskStatusResponseDTO toggleTaskStatus(
            String currentEmail,
            Long focusId,
            Long taskId
    ) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Focus focus = focusRepository.findByIdAndUser(focusId, user)
                .orElseThrow(() -> new NotFoundException("Focus not found"));

        Task task = taskRepository.findByIdAndFocus(taskId, focus)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        task.setStatus(!Boolean.TRUE.equals(task.getStatus()));

        Task updatedTask = taskRepository.save(task);

        return new ToggleTaskStatusResponseDTO(
                updatedTask.getId(),
                updatedTask.getFocus().getId(),
                updatedTask.getTitle(),
                updatedTask.getDescription(),
                updatedTask.getPriority(),
                updatedTask.getStatus(),
                updatedTask.getCreatedAt()
        );
    }

    private void ensureTaskQuota(Focus focus) {
        if (taskRepository.countByFocus(focus) >= MAX_ACTIVE_TASKS_PER_FOCUS) {
            throw new ValidationException(
                    "A focus can have up to 25 active tasks"
            );
        }
    }

}
