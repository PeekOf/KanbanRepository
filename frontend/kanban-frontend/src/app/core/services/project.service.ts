import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project, MoveTaskDto } from '../model/project.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/projects';

  // Nuestro Signal de Estado Global para el proyecto activo
  currentProject = signal<Project | null>(null);

  // CORREGIDO: Ahora carga el proyecto del usuario autenticado de forma dinámica
  loadUserProject(): void {
    this.http.get<Project>(`${this.apiUrl}/my-project`).subscribe({
      next: (project) => this.currentProject.set(project),
      error: (err) => console.error('Error al cargar el proyecto:', err)
    });
  }

  // Mover la tarea en el Backend y actualizar el estado local
  moveTask(moveDto: MoveTaskDto): void {
    this.http.put<void>(`${this.apiUrl}/move-task`, moveDto).subscribe({
      next: () => {
        // Refrescamos usando el método correcto sin IDs fijos
        this.loadUserProject();
      },
      error: (err) => console.error('Error al mover la tarea:', err)
    });
  }

  // Crear una nueva tarea dentro de una columna
  createTask(columnId: number, taskData: any): void {
    this.http.post('http://localhost:8080/api/tasks/column/' + columnId, taskData).subscribe({
      next: () => {
        console.log('Tarea creada con éxito');
        this.loadUserProject(); // 👈 Refresca el tablero automáticamente
      },
      error: (err) => console.error('Error al crear la tarea:', err)
    });
  }

  // Actualizar los datos de una tarea existente
  updateTask(taskId: number, taskData: any): void {
    const payload = {
      title: taskData.title || '',
      description: taskData.description || '',
      priority: taskData.priority || 'MEDIUM'
    };
    this.http.put(`http://localhost:8080/api/tasks/${taskId}`, payload).subscribe({
      next: () => {
        console.log('Tarea actualizada');
        this.loadUserProject(); // 👈 Refresca el tablero automáticamente
      },
      error: (err) => console.error('Error al actualizar:', err)
    });
  }

  // Eliminar una tarea por su ID
  deleteTask(taskId: number): void {
    this.http.delete(`http://localhost:8080/api/tasks/${taskId}`).subscribe({
      next: () => {
        console.log('Tarea eliminada con éxito');
        this.loadUserProject(); // 👈 Refresca el tablero automáticamente
      },
      error: (err) => console.error('Error al eliminar la tarea:', err)
    });
  }

  // Mantenemos este método por si lo usas en los guards o componentes de inicio
  getMyProject(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-project`);
  }
}
