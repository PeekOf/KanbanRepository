package com.kanbansync.backend.domain.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kanbansync.backend.domain.project.model.KanbanColumn;

@Repository
public interface KanbanColumnRepository extends JpaRepository<KanbanColumn, Long> {
}