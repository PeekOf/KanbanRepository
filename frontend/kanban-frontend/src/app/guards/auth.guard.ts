import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si hay un token, dejamos pasar al usuario
  if (authService.getToken()) {
    return true;
  }

  // Si no, lo echamos al login
  router.navigate(['/login']);
  return false;
};
