import { Component, OnInit, inject, signal } from '@angular/core';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../core/services/project.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../services/auth'; // 💡 Asegúrate de que la ruta sea correcta (.service si aplica)
import { Router } from '@angular/router';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit {
  // 📥 Inyección de Servicios Unificada (¡Sin usar constructor!)
  private projectService = inject(ProjectService);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // 📋 Variables de Estado
  targetColumnId!: number;
  loading: boolean = false;
  showModal: boolean = false;
  isEditMode: boolean = false;
  taskToProcess: any = null;
  showDeleteModal: boolean = false;

  // 🚦 Signals y Datos Compartidos
  project = this.projectService.currentProject;
  deletingTaskId = signal<number | null>(null);

  // 📝 Formulario Reactivo
  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    description: [''],
    priority: ['MEDIUM', Validators.required]
  });

  ngOnInit(): void {
    this.loading = true;

    this.projectService.getMyProject().subscribe({
      next: (data) => {
        this.project.set(data);
        this.loading = false;

        if (data && data.columns && data.columns.length > 0) {
          this.targetColumnId = data.columns[0].id;
        }
      },
      error: (err) => {
        console.error("Error al obtener el tablero:", err);
        this.loading = false;
      }
    });
  }

  // 🛠️ Gestión de Modales
  openEditModal(task: any): void {
    this.taskToProcess = {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority
    };

    this.isEditMode = true;
    this.showModal = true;

    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      priority: task.priority
    });
  }

  openDeleteModal(task: any): void {
    this.taskToProcess = task;
    this.isEditMode = false;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.taskForm.reset({ priority: 'MEDIUM' });
  }

  // 💾 Acciones de Persistencia (Guardar, Editar, Eliminar)
  confirmAction(): void {
    if (this.isEditMode) {
      this.projectService.updateTask(this.taskToProcess.id, this.taskForm.value);
      this.notificationService.success('Tarea actualizada correctamente');
    } else if (this.taskToProcess) {
      this.onDeleteTask(this.taskToProcess.id);
      this.notificationService.info('Tarea eliminada');
    }
    this.closeModal();
  }

  onDeleteTask(taskId: number): void {
    if (!taskId) return;
    this.deletingTaskId.set(taskId);
    this.projectService.deleteTask(taskId);
  }

  onSubmitTask(): void {
    if (this.taskForm.invalid) return;
    if (this.isEditMode) return;

    const newTaskPayload = {
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      priority: this.taskForm.value.priority,
      position: 0
    };

    this.projectService.createTask(this.targetColumnId, newTaskPayload);
    this.taskForm.reset({ priority: 'MEDIUM' });
  }

  // ↕️ Drag and Drop
  onTrackDrop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container && event.previousIndex === event.currentIndex) return;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }

    const taskMoved = event.container.data[event.currentIndex];
    this.projectService.moveTask({
      taskId: taskMoved.id,
      targetColumnId: Number(event.container.id),
      newPosition: event.currentIndex
    });
  }

  // 🚪 Autenticación
  cerrarSesion(): void {
    console.log('1. ¡Hiciste clic en el botón de cerrar sesión!');

    // Eliminamos el token de seguridad
    localStorage.removeItem('token');
    console.log('Token eliminado del localStorage');
    this.router.navigate(['/login']).then(nav => {
    }).catch(err => {
      console.error('Error al redirigir:', err);
    });
  }
}
