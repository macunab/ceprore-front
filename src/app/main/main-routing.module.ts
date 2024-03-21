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
// import { CheckingAccountsComponent } from "./pages/checking-accounts/checking-accounts.component";
import { PendingComponent } from "./pages/pending/pending.component";
import { InvoicedComponent } from "./pages/invoiced/invoiced.component";
import { PaidComponent } from "./pages/paid/paid.component";
import { PendingFormComponent } from "./pages/pending-form/pending-form.component";
import { isAuthenticatedGuard } from "../auth/guards/is-authenticated.guard";
import { HistoricComponent } from "./pages/historic/historic.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { CommissionCheckoutComponent } from "./pages/commission-checkout/commission-checkout.component";
import { ReportedCommissionComponent } from "./pages/reported-commission/reported-commission.component";
import { CheckingAccountsComponent } from "./pages/checking-accounts/checking-accounts.component";


const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            { path: 'customers', component: CustomersComponent, canActivate: [isAuthenticatedGuard] },
            { path: 'customer', component: CustomerFormComponent, canActivate: [isAuthenticatedGuard] },
            { path: 'home', component: DashboardComponent, canActivate: [isAuthenticatedGuard] },
            { path: 'factories', component: FactoriesComponent, canActivate: [isAuthenticatedGuard] },
            { path: 'products', component: ProductsComponent, canActivate: [isAuthenticatedGuard] },
            { path: 'priceLists', component: PriceListsComponent, canActivate: [isAuthenticatedGuard] },
            { path: 'deliveries', component: DeliveriesComponent, canActivate: [isAuthenticatedGuard] },
            { path: 'checking-accounts', component: CheckingAccountsComponent, canActivate: [isAuthenticatedGuard] },
            { path: 'pending-orders', component: PendingComponent, canActivate: [isAuthenticatedGuard] },
            { path: 'pending-order', component: PendingFormComponent, canActivate: [isAuthenticatedGuard] },
            { path: 'invoiced', component: InvoicedComponent, canActivate: [isAuthenticatedGuard] },
            { path: 'paid', component: PaidComponent, canActivate: [isAuthenticatedGuard] },
            { path: 'records', component: HistoricComponent, canActivate: [isAuthenticatedGuard] },
            { path: 'settings', component: SettingsComponent, canActivate: [isAuthenticatedGuard] },
            { path: 'commisioned', component: ReportedCommissionComponent, canActivate: [isAuthenticatedGuard] },
            { path: 'commission-settlement', component: CommissionCheckoutComponent, canActivate: [isAuthenticatedGuard]},
            { path: '**', redirectTo: 'home' }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class MainRoutingModule { }