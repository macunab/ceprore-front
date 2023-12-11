import { Routes } from '@angular/router';
import { CustomersComponent } from './main/pages/customers/customers.component';

export const routes: Routes = [
    {   path: 'main',
        loadChildren: () => import('./main/main.module').then(m => m.MainModule)
    },
    {
        path: '**',
        redirectTo: 'main'
    }

];
