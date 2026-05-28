package org.danielbreves.backend.controller;

import org.danielbreves.backend.dto.overview.OverviewResponseDTO;
import org.danielbreves.backend.service.OverviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping(value = "/overview")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class OverviewController {

    private final OverviewService overviewService;

    public OverviewController(OverviewService overviewService) {
        this.overviewService = overviewService;
    }

    @GetMapping
    public ResponseEntity<OverviewResponseDTO> getOverview(
            Principal principal
    ) {
        OverviewResponseDTO response =
                overviewService.getOverview(principal.getName());

        return ResponseEntity.ok(response);
    }
}
