import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';

import { InvoicedPercent, Order } from '../../interfaces/order.interface';

@Component({
  selector: 'app-paid-form-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, CommonModule, 
    InputTextareaModule, CurrencyPipe, InputNumberModule],
  templateUrl: './paid-form-dialog.component.html',
  styleUrl: './paid-form-dialog.component.css',
  providers: [CurrencyPipe]
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
  @Input() order: Order = {} as Order;
  @Input() loadingButton: boolean = false;
  @Output('onSubmit') emitter = new EventEmitter();
  orderPaid: Order = {} as Order;

  constructor(private fb: FormBuilder, private currencyPipe: CurrencyPipe) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.paidForm.reset({ justifiedDebitNote: 0, withholdings: 0, paymentOnAccount: 0 });
    if(this.order.invoice) {
      this.paidForm.patchValue(this.order.invoice!);
      this.paidForm.get('customer')?.patchValue(this.order.customer?.name);
      this.paidForm.get('factory')?.patchValue(this.order.factory?.name);
      this.paidForm.get('invoiceAmount')?.patchValue(this.order.invoice?.total);
      console.log(this.currencyPipe.transform(this.order.invoice?.total, 'USD', 'symbol', '3.0-3'))
      this.paidForm.get('commission')?.patchValue(this.calculateCommission(this.order.invoice.total, this.order.invoicedPercent!, 
        this.order.factory?.commission!, this.order.invoice.remitAmount));
    }
    if(this.order.payment) {
      this.paidForm.patchValue(this.order.payment);
    }
  }

  onSubmit(): void {
    if(this.paidForm.invalid) {
      this.paidForm.markAllAsTouched();
      return;
    }
    this.order.payment = { ...this.paidForm.value, total: this.paidForm.get('total')?.value,
      commission: this.paidForm.get('commission')?.value };
    this.order.status = 'PAID';
    this.order.createdPaymentDate = new Date();
    this.emitter.emit({ data: this.order });
  }

  isInvalid(field: string): boolean | null {
    return this.paidForm.controls[field].errors
      && this.paidForm.controls[field].touched;
  }

  onChangePaidAmounts(field: string): void {
    const debitNote: number = this.paidForm.get('justifiedDebitNote')!.value;
    const withholdings: number = this.paidForm.get('withholdings')!.value;
    const paidOnAccount: number = this.paidForm.get('paymentOnAccount')!.value;
    if(debitNote+withholdings+paidOnAccount < this.order.invoice!.total) {
      const newTotal: number = this.order.invoice!.total - this.paidForm.get('justifiedDebitNote')!.value;
      this.paidForm.get('total')?.patchValue(newTotal - this.paidForm.get('paymentOnAccount')?.value 
        - this.paidForm.get('withholdings')?.value);
      this.paidForm.get('commission')?.patchValue(this.calculateCommission(newTotal, this.order.invoicedPercent!, this.order.factory?.commission!, this.order.invoice?.remitAmount))
    } else {
      this.paidForm.controls[field].patchValue(0);
      this.onChangePaidAmounts(field);
      return;
    }
  }

  // test new function
  calculateCommission(total: number, invoicedPercent: InvoicedPercent, commissionPercent: number, remitAmount?: number): number {

    let commissionAmount: number = 0;
    console.log('REMITO ES:', remitAmount);
    if(invoicedPercent.percentNumber === 1 || remitAmount === 0) {
      commissionAmount = (total/1.21)*(commissionPercent/100);
    } else if(invoicedPercent.percentNumber === 0.5) {
      commissionAmount = (total/1.105)*commissionPercent/100;
    } else {
      commissionAmount = total*(commissionPercent/100);
    }
    return commissionAmount;
  }
}
