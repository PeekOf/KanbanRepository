import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // 👈 Cambiado JsonPipe por CommonModule para usar *ngIf

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule], // 👈 Añadido CommonModule
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null; // 👈 Nueva variable para el mensaje de éxito

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      return; // Detiene el envío si los campos no cumplen las reglas visuales
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: (response: any) => {
        // Si todo va bien (Código 200)
        console.log('Registro exitoso', response);
        this.errorMessage = null;

        // 👈 Guardamos el mensaje que viene del backend ("¡Usuario registrado con éxito!...")
        this.successMessage = response.message;

        // Limpiamos el formulario para que quede bonito
        this.registerForm.reset();

        // 👈 Esperamos 2.5 segundos para que lean el mensaje antes de redirigir
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2500);
      },
      error: (err) => {
        // Si el backend lanza un error (409 Conflict, etc.)
        console.error('Error capturado:', err);
        this.successMessage = null; // Limpiamos el éxito si ahora hay un error

        // 👈 Extraemos de forma segura la propiedad "error" del JSON
        if (err.error && err.error.error) {
          this.errorMessage = err.error.error; // Ej: "El correo ya está en uso" (depende de tu e.getMessage())
        } else {
          this.errorMessage = 'No se pudo completar el registro. Inténtalo más tarde.';
        }
      }
    });
  }
}
