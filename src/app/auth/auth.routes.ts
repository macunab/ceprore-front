import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { isNotAuthenticatedGuard } from "./guards/is-not-authenticated.guard";


export const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
        canActivate: [isNotAuthenticatedGuard]
    },
    { path: '**', redirectTo: '' }
]