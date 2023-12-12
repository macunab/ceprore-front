import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SidebarModule, PanelMenuModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  _showSidebar: boolean = false;
  @Input() set showSidebar(value: boolean) {
    this._showSidebar = value;
  }
  @Output('onHide') emmiter = new EventEmitter();

  hideSidebar() {
    this._showSidebar = false;
  }

  items: MenuItem[] = [
    { label: 'Home', icon: 'pi pi-home', routerLink: 'main/customers' },
    { label: 'Ordenes', icon: 'pi pi-shopping-cart', items: [
      { label: 'Pendientes', command: () => { this.hideSidebar() }},
      { label: 'Facturadas', command: () => { this.hideSidebar() }},
      { label: 'Cobradas', command: () => { this.hideSidebar() } }
    ]},
    { label: 'Clientes', icon: 'pi pi-users', routerLink: 'main/customers', command: () => { this.hideSidebar() } },
    { label: 'Fabricas', icon: 'pi pi-building', command: () => { this.hideSidebar() }},
    { label: 'Productos', icon: 'pi pi-gift', command: () => { this.hideSidebar() }},
    { label: 'Listas de precio', icon: 'pi pi-book', command: () => { this.hideSidebar() }},
    { label: 'Transportes', icon: 'pi pi-truck', command: () => { this.hideSidebar() }},
    { label: 'Cuenta corriente', icon: 'pi pi-wallet', command: () => { this.hideSidebar() }}
  ]

}
