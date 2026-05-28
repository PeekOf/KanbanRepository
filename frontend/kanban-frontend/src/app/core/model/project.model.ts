export interface Task {
  id?: number;
  title: string;
  description: string;
  position: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt?: string;
  updatedAt?: string;
}

export interface KanbanColumn {
  id: number;
  title: string;
  position: number;
  tasks: Task[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  columns: KanbanColumn[];
  createdAt?: string;
}

export interface MoveTaskDto {
  taskId: number;
  targetColumnId: number;
  newPosition: number;
}
