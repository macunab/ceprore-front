import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';

import { AuthService } from '../../../auth/services/auth.service';
import Validation from '../../../validators/validation';
import { checkPassValidator } from '../../../validators/check-pass.validator';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FieldsetModule, ToastModule, FormsModule, ReactiveFormsModule,
    ButtonModule, InputTextModule, PasswordModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  providers: [MessageService]
})
export class SettingsComponent {

  changePasswordForm: FormGroup = this.fb.group({
    actualPass: ['', [Validators.required, Validators.minLength(7)], [checkPassValidator(this.authService)]],
    newPass: ['', [Validators.required, Validators.minLength(7)]],
    repeatNewPass: ['', [Validators.required]],
  },
  { validators: [Validation.match('newPass', 'repeatNewPass')]}
  );
  loadingButton: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService,
      private message: MessageService) {}

  onSubmit(): void {

    if(this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }
    this.loadingButton = true;
    this.authService.updatePass(this.authService.user._id!,
       this.changePasswordForm.get('newPass')?.value)
       .subscribe({
        next: () => {
          this.changePasswordForm.reset();
          this.loadingButton = false;
          this.message.add({ severity: 'success', summary: 'Informacion',
            detail: 'Se ha modificado el password exitosamente.'});
        },
        error: () => {
          this.loadingButton = false;
          this.message.add({ severity: 'error', summary: 'ERROR!',
            detail: 'Ha ocurrido un error al intentar modificar el password.'});
        }
       });   
  }

  isInvalid(field: string): boolean | null {

    return this.changePasswordForm.controls[field].errors
      && this.changePasswordForm.controls[field].touched;
  }

}
