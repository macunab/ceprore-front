import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Order } from '../../interfaces/order.interface';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { Invoice } from '../../interfaces/invoice.interface';

@Component({
  selector: 'app-invoice-form-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, CommonModule,
    CalendarModule],
  templateUrl: './invoice-form-dialog.component.html',
  styleUrl: './invoice-form-dialog.component.css'
})
export class InvoiceFormDialogComponent implements OnChanges{

  invoiceForm: FormGroup = this.fb.group({
    invoiceCode: ['', [Validators.required]],
    invoiceDate: ['',[Validators.required]],
    paymentDeadline: [],
    deliveryTerm: [],
    invoicedAmount: [[Validators.required]],
    ivaAmount: [{value: '', disabled: true }, [Validators.required]],
    remitAmount: [[Validators.required]],
    total: [[Validators.required]]
  });
  @Input() order!: Order;
  @Input() invoiceUpdate!: Invoice;
  @Output('onClose') emmiter = new EventEmitter();
  invoice: Invoice = {} as Invoice;

  constructor(private fb: FormBuilder) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if(this.order !== undefined && this.order.id) {
      this.invoiceForm.patchValue(this.order);
    }
    if(this.invoiceUpdate !== undefined && this.invoiceUpdate.id) {
      this.invoiceForm.patchValue(this.invoiceUpdate);
    }
  }

  onSubmit(): void {
    if(this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      return;
    }
    this.order.status = 'INVOICED';
    this.invoice = { ...this.invoiceForm.value, order: this.order };
    this.emmiter.emit({ data: this.invoice });

  }

  isInvalid(field: string): boolean | null {
    return this.invoiceForm.controls[field].errors 
      && this.invoiceForm.controls[field].touched;
  }
}
