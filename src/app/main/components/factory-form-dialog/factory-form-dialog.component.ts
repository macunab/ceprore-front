import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { Factory } from '../../interfaces/factory.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-factory-form-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, CheckboxModule, CommonModule],
  templateUrl: './factory-form-dialog.component.html',
  styleUrl: './factory-form-dialog.component.css'
})
export class FactoryFormDialogComponent implements OnChanges {

  @Output('onClose') emmiter = new EventEmitter();
  @Input() factoryUpdate!: Factory;
  factoryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    province: [''],
    provincialTown: [''],
    address: [''],
    email: ['', [Validators.email, Validators.required]],
    retainCommision: [false],
    limitDays: [5]
  });

  constructor(private fb: FormBuilder) {}

  // ToDO fix performance
  ngOnChanges(changes: SimpleChanges): void {
    if(this.factoryUpdate.id) {
      this.factoryForm.patchValue(this.factoryUpdate);
    } else {
      this.factoryForm.reset({ retainCommision: false, limitDays: 5 });
    }
  }

  onSubmit() {
    if(this.factoryForm.invalid) {
      this.factoryForm.markAllAsTouched();
      return;
    }
    if(this.factoryUpdate.id) {
      this.factoryUpdate = { id: this.factoryUpdate.id, ...this.factoryForm.value };
      this.emmiter.emit({ data: this.factoryUpdate });
    } else {
      this.emmiter.emit({ data: this.factoryForm.value });
    }
  }

  isValid(field: string): boolean | null {
    return this.factoryForm.controls[field].errors 
      && this.factoryForm.controls[field].touched;
  }
}
