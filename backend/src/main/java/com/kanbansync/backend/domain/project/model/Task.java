package com.kanbansync.backend.domain.project.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "tasks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    private String description;

    private Integer position = 0;

    @Enumerated(EnumType.STRING)
    private TaskPriority priority = TaskPriority.MEDIUM;;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "column_id", nullable = false)
    @JsonIgnore
    @Setter(AccessLevel.NONE)
    private KanbanColumn column;

    // Método helper sincronizado perfectamente
    public void setColumn(KanbanColumn column) {
        this.column = column;
        if (column != null && column.getTasks() != null && !column.getTasks().contains(this)) {
            column.getTasks().add(this);
        }
    }
}