import { Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {

  const authService = Inject(AuthService);
  const router      = Inject(Router);
  if(authService.tokenValidation()) {
    router.navigateByUrl('/home');
    return false;
  }
  return true;
};
