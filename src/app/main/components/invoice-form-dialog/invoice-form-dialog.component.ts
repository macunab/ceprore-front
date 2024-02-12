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
    invoicedAmount: [0,[Validators.required]],
    ivaAmount: [{value: '', disabled: true }, [Validators.required]],
    remitAmount: [0, [Validators.required]],
    total: [[Validators.required]]
  });
  @Input() order!: Order;
  @Input() invoiceUpdate!: Invoice;
  @Output('onClose') emmiter = new EventEmitter();
  invoice: Invoice = {} as Invoice;

  constructor(private fb: FormBuilder) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if(this.order !== undefined && this.order._id) {
      this.invoiceForm.patchValue(this.order);
    }
    if(this.order.invoice !== undefined) {
      this.invoiceForm.patchValue(this.order);
      this.invoiceForm.patchValue(this.order.invoice);
      const formattedDate = new Date(this.order.invoice.invoiceDate);
      this.invoiceForm.get('invoiceDate')?.setValue(formattedDate);
    }
  }

  onSubmit(): void {
    if(this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      return;
    }
    if(this.order.invoice !== undefined) {
      this.invoice = { ...this.invoiceForm.value,
        ivaAmount: this.invoiceForm.get('ivaAmount')!.value };
      this.order.invoice = this.invoice;
    } else {
      this.invoice = { ...this.invoiceForm.value, ivaAmount: this.invoiceForm.get('ivaAmount')!.value };
      this.order.status = 'INVOICED';
      this.order.invoice = this.invoice;
    }
    this.emmiter.emit({ data: this.order });
  }

  isInvalid(field: string): boolean | null {
    return this.invoiceForm.controls[field].errors 
      && this.invoiceForm.controls[field].touched;
  }

  onChangeAmount(): void {
    const newIvaAmount: number = this.invoiceForm.get('invoicedAmount')!.value*0.21;
    const total: number = newIvaAmount+this.invoiceForm.get('invoicedAmount')!.value + this.invoiceForm.get('remitAmount')!.value;
    this.invoiceForm.get('total')?.patchValue(total);
    this.invoiceForm.get('ivaAmount')?.patchValue(newIvaAmount);
  }
}
