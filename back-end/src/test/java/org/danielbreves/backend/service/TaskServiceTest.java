package org.danielbreves.backend.service;

import org.danielbreves.backend.dto.task.CreateTaskRequestDTO;
import org.danielbreves.backend.dto.task.CreateTaskResponseDTO;
import org.danielbreves.backend.entity.Focus;
import org.danielbreves.backend.entity.Task;
import org.danielbreves.backend.entity.User;
import org.danielbreves.backend.entity.enums.TaskPriority;
import org.danielbreves.backend.repository.FocusRepository;
import org.danielbreves.backend.repository.TaskRepository;
import org.danielbreves.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class TaskServiceTest {

    @Test
    void createTaskFindsFocusByIdAndCurrentUserBeforeSaving() {
        TaskRepository taskRepository = mock(TaskRepository.class);
        FocusRepository focusRepository = mock(FocusRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        TaskService taskService = new TaskService(
                taskRepository,
                focusRepository,
                userRepository
        );

        String currentEmail = "user@test.com";
        User user = new User(1L, "User", "username", "password", currentEmail, null);
        Focus focus = new Focus(10L, user, "Study", null);
        CreateTaskRequestDTO requestDTO =
                new CreateTaskRequestDTO(
                        "Read chapter",
                        "Read the first chapter",
                        TaskPriority.ALTA
                );
        LocalDateTime createdAt = LocalDateTime.now();

        when(userRepository.findByEmail(currentEmail)).thenReturn(Optional.of(user));
        when(focusRepository.findByIdAndUser(10L, user)).thenReturn(Optional.of(focus));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
            Task task = invocation.getArgument(0);
            return new Task(
                    20L,
                    task.getFocus(),
                    task.getTitle(),
                    task.getDescription(),
                    task.getPriority(),
                    false,
                    createdAt
            );
        });

        CreateTaskResponseDTO responseDTO =
                taskService.createTask(currentEmail, 10L, requestDTO);

        verify(userRepository).findByEmail(currentEmail);
        verify(focusRepository).findByIdAndUser(10L, user);
        assertEquals(20L, responseDTO.id());
        assertEquals(10L, responseDTO.idFocus());
        assertEquals("Read chapter", responseDTO.title());
        assertEquals("Read the first chapter", responseDTO.description());
        assertEquals(TaskPriority.ALTA, responseDTO.priority());
        assertEquals(false, responseDTO.status());
        assertEquals(createdAt, responseDTO.createdAt());
    }
}
