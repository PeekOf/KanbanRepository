import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, JsonPipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onRegister() {
    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        // Si todo va bien (Código 200)
        console.log('Registro exitoso', response);
        this.errorMessage = null;
        // Aquí rediriges al dashboard o al login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // Si el backend lanza un error (409 o 401)
        console.error('Error capturado:', err);
        // Extraemos el mensaje de texto que enviamos desde el backend
        this.errorMessage = err.error ? err.error : 'Ocurrió un error inesperado';
      }
    });
  }
}
