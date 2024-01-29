import { Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {

  const authService = Inject(AuthService);
  const router      = Inject(Router);

  if(authService.tokenValidation()) {
    return true;
  }
  console.log('NO EXISTE EL TOKEN');
  router.navigateByUrl('/login');
  return false;
};
