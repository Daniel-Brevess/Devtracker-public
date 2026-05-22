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
import org.danielbreves.backend.entity.enums.TaskPriority;
import org.danielbreves.backend.repository.FocusRepository;
import org.danielbreves.backend.repository.TaskRepository;
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

    @Test
    void getTasksByFocusFindsFocusByIdAndCurrentUserBeforeReturningTasks() {
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
        LocalDateTime createdAt = LocalDateTime.now();
        Task task = new Task(
                20L,
                focus,
                "Read chapter",
                "Read the first chapter",
                TaskPriority.ALTA,
                false,
                createdAt
        );

        when(userRepository.findByEmail(currentEmail)).thenReturn(Optional.of(user));
        when(focusRepository.findByIdAndUser(10L, user)).thenReturn(Optional.of(focus));
        when(taskRepository.findAllByFocus(focus)).thenReturn(List.of(task));

        List<TaskResponseDTO> responseDTO =
                taskService.getTasksByFocus(currentEmail, 10L);

        verify(userRepository).findByEmail(currentEmail);
        verify(focusRepository).findByIdAndUser(10L, user);
        verify(taskRepository).findAllByFocus(focus);
        assertEquals(1, responseDTO.size());
        assertEquals(20L, responseDTO.get(0).id());
        assertEquals(10L, responseDTO.get(0).idFocus());
        assertEquals("Read chapter", responseDTO.get(0).title());
        assertEquals("Read the first chapter", responseDTO.get(0).description());
        assertEquals(TaskPriority.ALTA, responseDTO.get(0).priority());
        assertEquals(false, responseDTO.get(0).status());
        assertEquals(createdAt, responseDTO.get(0).createdAt());
    }

    @Test
    void updateTaskFindsTaskByIdAndFocusOwnedByCurrentUserBeforeSaving() {
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
        LocalDateTime createdAt = LocalDateTime.now();
        Task task = new Task(
                20L,
                focus,
                "Read chapter",
                "Read the first chapter",
                TaskPriority.ALTA,
                false,
                createdAt
        );
        UpdateTaskRequestDTO requestDTO = new UpdateTaskRequestDTO(
                "Updated chapter",
                "Read the second chapter",
                TaskPriority.MEDIA
        );

        when(userRepository.findByEmail(currentEmail)).thenReturn(Optional.of(user));
        when(focusRepository.findByIdAndUser(10L, user)).thenReturn(Optional.of(focus));
        when(taskRepository.findByIdAndFocus(20L, focus)).thenReturn(Optional.of(task));
        when(taskRepository.save(task)).thenReturn(task);

        UpdateTaskResponseDTO responseDTO =
                taskService.updateTask(currentEmail, 10L, 20L, requestDTO);

        verify(userRepository).findByEmail(currentEmail);
        verify(focusRepository).findByIdAndUser(10L, user);
        verify(taskRepository).findByIdAndFocus(20L, focus);
        verify(taskRepository).save(task);
        assertEquals(20L, responseDTO.id());
        assertEquals(10L, responseDTO.idFocus());
        assertEquals("Updated chapter", responseDTO.title());
        assertEquals("Read the second chapter", responseDTO.description());
        assertEquals(TaskPriority.MEDIA, responseDTO.priority());
        assertEquals(false, responseDTO.status());
        assertEquals(createdAt, responseDTO.createdAt());
    }

    @Test
    void deleteTaskFindsTaskByIdAndFocusOwnedByCurrentUserBeforeDeleting() {
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
        LocalDateTime createdAt = LocalDateTime.now();
        Task task = new Task(
                20L,
                focus,
                "Read chapter",
                "Read the first chapter",
                TaskPriority.ALTA,
                false,
                createdAt
        );

        when(userRepository.findByEmail(currentEmail)).thenReturn(Optional.of(user));
        when(focusRepository.findByIdAndUser(10L, user)).thenReturn(Optional.of(focus));
        when(taskRepository.findByIdAndFocus(20L, focus)).thenReturn(Optional.of(task));

        DeleteTaskResponseDTO responseDTO =
                taskService.deleteTask(currentEmail, 10L, 20L);

        verify(userRepository).findByEmail(currentEmail);
        verify(focusRepository).findByIdAndUser(10L, user);
        verify(taskRepository).findByIdAndFocus(20L, focus);
        verify(taskRepository).delete(task);
        assertEquals("Task deleted successfully", responseDTO.message());
    }

    @Test
    void toggleTaskStatusFindsTaskByIdAndFocusOwnedByCurrentUserBeforeSaving() {
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
        LocalDateTime createdAt = LocalDateTime.now();
        Task task = new Task(
                20L,
                focus,
                "Read chapter",
                "Read the first chapter",
                TaskPriority.ALTA,
                false,
                createdAt
        );

        when(userRepository.findByEmail(currentEmail)).thenReturn(Optional.of(user));
        when(focusRepository.findByIdAndUser(10L, user)).thenReturn(Optional.of(focus));
        when(taskRepository.findByIdAndFocus(20L, focus)).thenReturn(Optional.of(task));
        when(taskRepository.save(task)).thenReturn(task);

        ToggleTaskStatusResponseDTO responseDTO =
                taskService.toggleTaskStatus(currentEmail, 10L, 20L);

        verify(userRepository).findByEmail(currentEmail);
        verify(focusRepository).findByIdAndUser(10L, user);
        verify(taskRepository).findByIdAndFocus(20L, focus);
        verify(taskRepository).save(task);
        assertEquals(20L, responseDTO.id());
        assertEquals(10L, responseDTO.idFocus());
        assertEquals("Read chapter", responseDTO.title());
        assertEquals("Read the first chapter", responseDTO.description());
        assertEquals(TaskPriority.ALTA, responseDTO.priority());
        assertEquals(true, responseDTO.status());
        assertEquals(createdAt, responseDTO.createdAt());
    }

}
