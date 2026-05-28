package com.kanbansync.backend.domain.project.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class MoveTaskDto {
    private Long taskId;
    private Long targetColumnId;
    private Integer newPosition;
}