import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  changePasswordForm: FormGroup = this.fb.group({
    actualPass: ['', [Validators.required]],
    newPass: ['', [Validators.required, Validators.minLength(7)]],
    repeatNewPass: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder) {}

  onSubmit(): void {
    
  }

}
