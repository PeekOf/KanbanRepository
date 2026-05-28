import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // 👈 Importante para usar *ngIf en el HTML de componentes standalone

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule], // 👈 Añadido CommonModule aquí
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return; // Detiene la ejecución si el formulario no es válido visualmente
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        // Si todo va bien (Código 200)
        console.log('Inicio de sesión exitoso', response);
        this.errorMessage = null;

        // Redirige al dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Si el backend lanza un error (401, 409, etc.)
        console.error('Error capturado:', err);

        // 👈 Extraemos de forma segura la propiedad "error" dentro del cuerpo del error del JSON
        if (err.error && err.error.error) {
          this.errorMessage = err.error.error; // Esto guardará: "Correo o contraseña incorrectos..."
        } else {
          this.errorMessage = 'No se pudo conectar con el servidor. Inténtalo más tarde.';
        }
      }
    });
  }
}
