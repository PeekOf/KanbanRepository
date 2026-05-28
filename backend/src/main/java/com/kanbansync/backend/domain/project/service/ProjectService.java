package com.kanbansync.backend.domain.project.service;

import com.kanbansync.backend.domain.project.model.*;
import com.kanbansync.backend.domain.project.repository.*;  
import com.kanbansync.backend.domain.project.dto.MoveTaskDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final KanbanColumnRepository columnRepository;
    private final TaskRepository taskRepository;

   @Transactional(readOnly = true)
    public Project getProjectBoard(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado con ID: " + projectId));
        project.getColumns().forEach(column -> column.getTasks().size());
        
        return project;
    }

    @Transactional
    public Project createProject(Project project) {
        Project savedProject = projectRepository.save(project);
        
        String[] defaultColumns = {"Por Hacer", "En Progreso", "Terminado"};
        for (int i = 0; i < defaultColumns.length; i++) {
            KanbanColumn column = KanbanColumn.builder()
                    .title(defaultColumns[i])
                    .position(i)
                    .project(savedProject)
                    .build();
            columnRepository.save(column);
        }
        return savedProject;
    }

    @Transactional
    public void moveTask(MoveTaskDto moveDto) {
        //Buscar la tarea que se va a mover
        Task task = taskRepository.findById(moveDto.getTaskId())
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        //Buscar la columna de destino
        KanbanColumn targetColumn = columnRepository.findById(moveDto.getTargetColumnId())
                .orElseThrow(() -> new RuntimeException("Columna de destino no encontrada"));

        //Hacer hueco en la columna de destino incrementando la posición de las tareas existentes
        List<Task> targetTasks = targetColumn.getTasks();
        for (Task t : targetTasks) {
            if (t.getPosition() >= moveDto.getNewPosition()) {
                t.setPosition(t.getPosition() + 1);
            }
        }

        //Actualizar la tarea con su nueva columna y posición
        task.setColumn(targetColumn);
        task.setPosition(moveDto.getNewPosition());

        //Guardar los cambios (gracias a @Transactional, Hibernate guardará todo de golpe al finalizar)
        taskRepository.save(task);
    }

    public List<Project> getProjectsForUser(Long userId) {
        return projectRepository.findByUserId(userId);
    }

    public Optional<Project> findFirstByUserEmail(String email) {
        return projectRepository.findFirstByUserEmail(email);
    }
}