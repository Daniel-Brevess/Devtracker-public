package org.danielbreves.backend.controller;

import jakarta.validation.Valid;
import org.danielbreves.backend.dto.task.CreateTaskRequestDTO;
import org.danielbreves.backend.dto.task.CreateTaskResponseDTO;
import org.danielbreves.backend.dto.task.TaskResponseDTO;
import org.danielbreves.backend.dto.task.UpdateTaskRequestDTO;
import org.danielbreves.backend.dto.task.UpdateTaskResponseDTO;
import org.danielbreves.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping(value = "/task")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping("/focus/{focusId}/create")
    public ResponseEntity<CreateTaskResponseDTO> createTask(
            @PathVariable Long focusId,
            @RequestBody @Valid CreateTaskRequestDTO requestDTO,
            Principal principal
    ) {
        CreateTaskResponseDTO responseDTO =
                taskService.createTask(principal.getName(), focusId, requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping("/focus/{focusId}/all")
    public ResponseEntity<List<TaskResponseDTO>> getTasksByFocus(
            @PathVariable Long focusId,
            Principal principal
    ) {
        List<TaskResponseDTO> responseDTO =
                taskService.getTasksByFocus(principal.getName(), focusId);

        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/focus/{focusId}/{taskId}/update")
    public ResponseEntity<UpdateTaskResponseDTO> updateTask(
            @PathVariable Long focusId,
            @PathVariable Long taskId,
            @RequestBody @Valid UpdateTaskRequestDTO requestDTO,
            Principal principal
    ) {
        UpdateTaskResponseDTO responseDTO =
                taskService.updateTask(
                        principal.getName(),
                        focusId,
                        taskId,
                        requestDTO
                );

        return ResponseEntity.ok(responseDTO);
    }
}
