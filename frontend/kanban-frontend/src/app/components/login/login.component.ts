import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
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
      this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        // Si todo va bien (Código 200)
        console.log('Inicio de sesión exitoso', response);
        this.errorMessage = null;
        // Aquí rediriges al dashboard o al login
        this.router.navigate(['/dashboard']);
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
