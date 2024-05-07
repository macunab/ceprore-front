import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SidebarModule, RippleModule, StyleClassModule, RouterModule],
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
    console.log('EL ESTADO DEL SIDEBAR ES: ', this._showSidebar)
  }

}
