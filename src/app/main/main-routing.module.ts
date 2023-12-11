import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { CustomersComponent } from "./pages/customers/customers.component";
import { NgModule } from "@angular/core";
import { CustomerFormComponent } from "./pages/customer-form/customer-form.component";


const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            { path: 'customers', component: CustomersComponent },
            { path: 'customer', component: CustomerFormComponent },
            { path: '**', redirectTo: 'customers' }
        ]
    },
    { path: '**', redirectTo: 'customers'}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class MainRoutingModule { }