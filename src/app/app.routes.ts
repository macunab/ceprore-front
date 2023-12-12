import { Routes } from '@angular/router';

export const routes: Routes = [
    {   path: 'main',
        loadChildren: () => import('./main/main.module').then(m => m.MainModule)
    },
    {
        path: '**',
        redirectTo: 'main'
    }

];
