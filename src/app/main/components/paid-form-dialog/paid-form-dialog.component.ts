import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Paid } from '../../interfaces/paid.interface';
import { Invoice } from '../../interfaces/invoice.interface';

@Component({
  selector: 'app-paid-form-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, CommonModule, 
    InputTextareaModule],
  templateUrl: './paid-form-dialog.component.html',
  styleUrl: './paid-form-dialog.component.css'
})
export class PaidFormDialogComponent implements OnChanges{

  paidForm: FormGroup = this.fb.group({
    customer: [{ value: '', disabled: true }],
    factory: [{ value: '', disabled: true }],
    invoiceCode: [{ value: '', disabled: true }],
    invoiceAmount: [{ value: 0, disabled: true }],
    justifiedDebitNote: [0, [Validators.required]],
    justifiedDebitNoteObservations: [''],
    withholdings: [0, [Validators.required]],
    withholdingsObservations: [''],
    paymentOnAccount: [0, [Validators.required]],
    total: [{ value: 0, disabled: true}],
    commission: [{ value: 0, disabled: true }]
  });
  @Input() paidUpdate: Paid = {} as Paid;
  @Input() invoice: Invoice = {} as Invoice;
  @Output('onSubmit') emitter = new EventEmitter();
  paid: Paid = {} as Paid;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if(this.paidUpdate.id) {

    }
    if(this.invoice.id) {
      this.paidForm.patchValue(this.invoice);
      this.paidForm.get('customer')?.patchValue(this.invoice.order.customer?.name);
      this.paidForm.get('factory')?.patchValue(this.invoice.order.factory?.name);
      this.paidForm.get('invoiceAmount')?.patchValue(this.invoice.total);
      this.paidForm.get('commission')?.patchValue(this.invoice.order.factory?.commission!*this.invoice.total);
    }
  }

  onSubmit(): void {
    if(this.paidForm.invalid) {
      this.paidForm.markAllAsTouched();
      console.log('TIENE ERRORES')
      return;
    }
    if(this.paidUpdate.id) {

    } else {
      this.paid = { ...this.paidForm.value, invoice: this.invoice, total: this.paidForm.get('total')!.value,
      commission: this.paidForm.get('commission')!.value };
    }
    this.emitter.emit({ data: this.paid });
  }

  isInvalid(field: string): boolean | null {
    return this.paidForm.controls[field].errors
      && this.paidForm.controls[field].touched;
  }

  onChangePaidAmounts(field: string): void {
    const debitNote: number = this.paidForm.get('justifiedDebitNote')!.value;
    const withholdings: number = this.paidForm.get('withholdings')!.value;
    const paidOnAccount: number = this.paidForm.get('paymentOnAccount')!.value;
    if(debitNote+withholdings+paidOnAccount < this.invoice.total) {
      const newTotal: number = this.invoice.total - this.paidForm.get('justifiedDebitNote')!.value;
      this.paidForm.get('total')?.patchValue(newTotal - this.paidForm.get('paymentOnAccount')?.value 
        - this.paidForm.get('withholdings')?.value);
      this.paidForm.get('commission')?.patchValue(newTotal * this.invoice.order.factory?.commission!);
    } else {
      this.paidForm.controls[field].patchValue(0);
    }
  }
}
