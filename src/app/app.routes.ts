import { Routes } from '@angular/router';

export const routes: Routes = [
    {   path: 'main',
        loadChildren: () => import('./main/main.module').then(m => m.MainModule)
    },
    {
        path: 'login',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: '**',
        redirectTo: 'main'
    }

];
