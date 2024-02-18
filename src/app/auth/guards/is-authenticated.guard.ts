import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces/auth-status.enum';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {

  const authService: AuthService = inject(AuthService);
  const router = inject(Router);
  
   authService.tokenValidation()
    .subscribe({
      // next: (res) => {
      //   console.log(res);
      //   console.log('ESTE ES EL TOKEN VALIDATION, ', authService.authStatus())
      // },
      // error: () => {
      //   console.log(err);
      // }
    });
  
  if(authService.authStatus() === AuthStatus.authenticated) {
    return true;
  }

  router.navigateByUrl('login');
  return false;
};
