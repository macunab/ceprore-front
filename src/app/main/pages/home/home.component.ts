import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  showSidebar: boolean = false;

  onSideBarAction() {
    console.log('SE ABRE EL SIDEBAR', this.showSidebar);
    this.showSidebar = true;
  }

  onSidebarHide() {
    this.showSidebar = false;
  }

}
