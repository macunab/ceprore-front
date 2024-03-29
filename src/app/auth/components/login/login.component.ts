import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CheckboxModule, InputTextModule, ButtonModule, FormsModule, ReactiveFormsModule,
    CommonModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export class LoginComponent {

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberme: [false]
  });
  loadingButton: boolean = false;

  constructor(private fb: FormBuilder, private message: MessageService,
    private authService: AuthService, private router: Router) {}

  /**
   * Rememberme function: if true must be create a token and save in the cookies/localstorage
   * and remove/delete when logout.
   * the token created when rememberme is true is different from when it is false. When it is true,
   * the token has a longer or even unlimited expiration date, while when it is false, the token only lasts a few minutes and is renewed while browsing the page,
   * this means that in case of inactivity the token will stop be valid and you must log in again (it can be valid for 60/30 minutes maximum).
   */
  onSubmit(): void {
    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loadingButton = true;
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('main/home');
          this.loadingButton = false;
        },
        error: err => {
          console.log(err);
          this.loadingButton = false;
          this.message.add({ severity: 'error', summary: 'Credenciales no validas!',
            detail: 'El email o password no son validos.'});
        }
      });
  }

  isInvalid(field: string): boolean | null {
    return this.loginForm.controls[field].errors
      && this.loginForm.controls[field].touched;
  }

}
