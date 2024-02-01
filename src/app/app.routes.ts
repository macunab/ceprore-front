import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './auth/guards/is-authenticated.guard';
import { isNotAuthenticatedGuard } from './auth/guards/is-not-authenticated.guard';

export const routes: Routes = [
    {   path: 'main',
        canActivate: [isAuthenticatedGuard],
        loadChildren: () => import('./main/main.module').then(m => m.MainModule),
    },
    {
        path: 'login',
        canActivate: [isNotAuthenticatedGuard],
        loadChildren: () => import('./auth/auth.routes').then(m => m.routes)
    },
    {
        path: '**',
        redirectTo: 'main'
    }

];
