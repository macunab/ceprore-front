import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { CustomersComponent } from "./pages/customers/customers.component";
import { NgModule } from "@angular/core";
import { CustomerFormComponent } from "./pages/customer-form/customer-form.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { FactoriesComponent } from "./pages/factories/factories.component";
import { ProductsComponent } from "./pages/products/products.component";
import { PriceListsComponent } from "./pages/price-lists/price-lists.component";
import { DeliveriesComponent } from "./pages/deliveries/deliveries.component";
import { CheckingAccountsComponent } from "./pages/checking-accounts/checking-accounts.component";
import { PendingComponent } from "./pages/pending/pending.component";
import { InvoicedComponent } from "./pages/invoiced/invoiced.component";
import { PaidComponent } from "./pages/paid/paid.component";


const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            { path: 'customers', component: CustomersComponent },
            { path: 'customer', component: CustomerFormComponent },
            { path: 'home', component: DashboardComponent },
            { path: 'factories', component: FactoriesComponent },
            { path: 'products', component: ProductsComponent },
            { path: 'priceLists', component: PriceListsComponent },
            { path: 'deliveries', component: DeliveriesComponent },
            { path: 'checking-accounts', component: CheckingAccountsComponent },
            { path: 'pending', component: PendingComponent },
            { path: 'invoiced', component: InvoicedComponent },
            { path: 'paid', component: PaidComponent },
            { path: '**', redirectTo: 'home' }
        ]
    },
    //{ path: '**', redirectTo: 'home'}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class MainRoutingModule { }