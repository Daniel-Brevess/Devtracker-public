package org.danielbreves.backend.controller;

import jakarta.validation.Valid;
import org.danielbreves.backend.dto.goal.CreateGoalRequestDTO;
import org.danielbreves.backend.dto.goal.CreateGoalResponseDTO;
import org.danielbreves.backend.dto.goal.DeleteGoalResponseDTO;
import org.danielbreves.backend.dto.goal.GoalResponseDTO;
import org.danielbreves.backend.dto.goal.UpdateGoalRequestDTO;
import org.danielbreves.backend.dto.goal.UpdateGoalResponseDTO;
import org.danielbreves.backend.service.GoalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@RequestMapping(value = "/goal")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @PostMapping("/create")
    public ResponseEntity<CreateGoalResponseDTO> createGoal(
            @RequestBody @Valid CreateGoalRequestDTO requestDTO,
            Principal principal
    ) {
        CreateGoalResponseDTO responseDTO =
                goalService.createGoal(principal.getName(), requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping("/all")
    public ResponseEntity<List<GoalResponseDTO>> getAllGoals(
            Principal principal
    ) {
        List<GoalResponseDTO> responseDTO =
                goalService.getAllGoals(principal.getName());

        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/{goalId}/update")
    public ResponseEntity<UpdateGoalResponseDTO> updateGoal(
            @PathVariable Long goalId,
            @RequestBody @Valid UpdateGoalRequestDTO requestDTO,
            Principal principal
    ) {
        UpdateGoalResponseDTO responseDTO =
                goalService.updateGoal(
                        principal.getName(),
                        goalId,
                        requestDTO
                );

        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{goalId}/delete")
    public ResponseEntity<DeleteGoalResponseDTO> deleteGoal(
            @PathVariable Long goalId,
            Principal principal
    ) {
        DeleteGoalResponseDTO responseDTO =
                goalService.deleteGoal(
                        principal.getName(),
                        goalId
                );

        return ResponseEntity.ok(responseDTO);
    }
}
