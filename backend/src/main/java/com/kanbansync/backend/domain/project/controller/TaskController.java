package com.kanbansync.backend.domain.project.controller;

import com.kanbansync.backend.domain.project.model.Task;
import com.kanbansync.backend.domain.project.model.TaskPriority;
import com.kanbansync.backend.domain.project.repository.KanbanColumnRepository;
import com.kanbansync.backend.domain.project.repository.TaskRepository;
import com.kanbansync.backend.domain.project.dto.MoveTaskDto;
import com.kanbansync.backend.domain.project.model.KanbanColumn;
import com.kanbansync.backend.domain.project.service.ProjectService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {

    private final TaskRepository taskRepository;
    private final KanbanColumnRepository columnRepository;
    private final ProjectService projectService;

    @Autowired
    public TaskController(ProjectService projectService, TaskRepository taskRepository, KanbanColumnRepository columnRepository) {
        this.projectService = projectService;
        this.taskRepository = taskRepository;
        this.columnRepository = columnRepository;
    }

    @PostMapping("/column/{columnId}")
    public ResponseEntity<?> createTask(@PathVariable Long columnId, @RequestBody Task taskRequest) {
        return columnRepository.findById(columnId).map(column -> {
            
            taskRequest.setColumn(column);
            
            // 👈 EL SEGURO DE VIDA: Forzamos la posición a 0 si viene nula
            if (taskRequest.getPosition() == null) {
                taskRequest.setPosition(0); 
            }
            
            Task savedTask = taskRepository.save(taskRequest);
            return ResponseEntity.ok(savedTask);
            
        }).orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        if (taskRepository.existsById(taskId)) {
            taskRepository.deleteById(taskId);
            return ResponseEntity.noContent().build(); // Devuelve un estado 204 (Sin contenido, todo OK)
        }
        return ResponseEntity.notFound().build(); // Devuelve 404 si la tarea no existe
    }

    @PostMapping("/move")
    public ResponseEntity<Void> moveTask(@RequestBody MoveTaskDto moveDto) {
        // Llamamos a la lógica que ya tienes empezada en tu ProjectService
        projectService.moveTask(moveDto);
        return ResponseEntity.ok().build();
    }

    // Editar tarea
    @PutMapping("/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskId, @RequestBody Task taskDetails) {
        return taskRepository.findById(taskId).map(task -> {
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setPriority(taskDetails.getPriority());
        
        return ResponseEntity.ok(taskRepository.save(task));
    }).orElse(ResponseEntity.notFound().build());
    }
}