package org.danielbreves.backend.controller;

import org.danielbreves.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/task")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class TaskController {

    @Autowired
    private TaskService taskService;
}
