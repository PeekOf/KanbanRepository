package com.kanbansync.backend.domain.project.controller;

import com.kanbansync.backend.domain.project.model.Project;
import com.kanbansync.backend.domain.project.repository.ProjectRepository;
import com.kanbansync.backend.domain.project.dto.MoveTaskDto;
import com.kanbansync.backend.domain.project.service.*;
import lombok.RequiredArgsConstructor;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.kanbansync.backend.domain.project.model.User;
import java.util.Optional;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200") 
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;
    private final ProjectService projectService;
    private final UserService userService;


    @GetMapping
    public List<Project> getMyProjects(Principal principal) {
        return projectRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        Project createdProject = projectService.createProject(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

    @PutMapping("/move-task")
    public ResponseEntity<Void> moveTask(@RequestBody MoveTaskDto moveTaskDto) {
        try {
            projectService.moveTask(moveTaskDto);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // En tu ProjectController.java
    @GetMapping("/my-project")
    public ResponseEntity<?> getUserProject(Authentication authentication) {
        // Spring Security extrae automáticamente el email del JWT
        String userEmail = authentication.getName(); 
        
        // Buscas en la base de datos el proyecto que le pertenece a ese email
        Optional<Project> project = projectService.findFirstByUserEmail(userEmail);
        
        if (project.isPresent()) {
            return ResponseEntity.ok(project.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}