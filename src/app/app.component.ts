import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces/auth-status.enum';
import { SpinnerComponent } from './shared/spinner/spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ceprore-front';

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  public finishedAuthCheck = computed<boolean>(() => {
    if(this.authService.authStatus() === AuthStatus.checking) {
      return false;
    }
    return true;
  });

  public authStatusChangeEffect = effect(() => {
    switch(this.authService.authStatus()) {
      case AuthStatus.checking:
        return;
      case AuthStatus.authenticated:
        this.router.navigateByUrl('home')
        return;
      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('login');
        return;
    }
  })
}
