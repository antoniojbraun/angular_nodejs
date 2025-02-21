import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  const router = inject(Router);
  if (authService.session) {
    // verify if token is stil valid

    return true;
  }
  router.navigate(['/auth/login']);
  return false;
};
