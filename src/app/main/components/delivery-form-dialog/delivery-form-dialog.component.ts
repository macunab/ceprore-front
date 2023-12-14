import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';

import { Delivery } from '../../interfaces/delivery.interface';

@Component({
  selector: 'app-delivery-form-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, CommonModule],
  templateUrl: './delivery-form-dialog.component.html',
  styleUrl: './delivery-form-dialog.component.css'
})
export class DeliveryFormDialogComponent implements OnChanges{

  @Output('onClose') emmiter = new EventEmitter();
  @Input() deliveryUpdate!: Delivery;
  deliveryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    address: [''],
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(private fb:  FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if(this.deliveryUpdate.id) {
      this.deliveryForm.patchValue(this.deliveryUpdate);
    } else {
      this.deliveryForm.reset();
    }
  }

  onSubmit(): void {
    if(this.deliveryForm.invalid) {
      this.deliveryForm.markAllAsTouched();
      return;
    }
    if(this.deliveryUpdate.id) {
      this.deliveryUpdate = { id: this.deliveryUpdate.id, ...this.deliveryForm.value };
      this.emmiter.emit({ data: this.deliveryUpdate });
    } else {
      this.emmiter.emit({ data: this.deliveryForm.value });
    }
  }

  isValid(field: string): boolean | null {
    return this.deliveryForm.controls[field].errors
      && this.deliveryForm.controls[field].touched;
  }
}
