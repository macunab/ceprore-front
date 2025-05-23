import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopup, ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Order } from '../../interfaces/order.interface';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { Invoice } from '../../interfaces/invoice.interface';
import { InputNumberModule } from 'primeng/inputnumber';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-invoice-form-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, CommonModule,
    CalendarModule, InputNumberModule, ToastModule, ConfirmPopupModule, ConfirmDialogModule],
  templateUrl: './invoice-form-dialog.component.html',
  styleUrl: './invoice-form-dialog.component.css',
  providers: [ConfirmationService, MessageService]
})
export class InvoiceFormDialogComponent implements OnChanges{

  invoiceForm: FormGroup = this.fb.group({
    invoiceCode: ['', [Validators.required]],
    invoiceDate: ['',[Validators.required]],
    paymentDeadline: [],
    deliveryTerm: [30],
    invoicedAmount: [0,[Validators.required]],
    ivaAmount: [{value: '', disabled: true }, [Validators.required]],
    remitAmount: [0, [Validators.required]],
    total: [[Validators.required]]
  });
  @Input() order!: Order;
  @Input() invoiceUpdate!: Invoice;
  @Input() loadingButton: boolean = false;
  @Output('onClose') emmiter = new EventEmitter();
  invoice: Invoice = {} as Invoice;

  constructor(private fb: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService,
    private orderService: OrderService
  ) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    this.invoiceForm.reset({ deliveryTerm: 30, paymentDeadline: 30 });
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

  confirmDialog(event: Event) {

    this.loadingButton = true;
    console.log(this.order.factory!._id!);
    this.orderService.FindByInvoiceNumber(this.invoiceForm.get('invoiceCode')?.value, this.order.factory!._id!)
      .subscribe({
        next: res => {
          if(res.length > 0) {
            console.log(res);
            this.confirmationService.confirm({
              target: event.target as EventTarget,
              message: 'El numero de factura ya se encuentra registrado para esa representada, desea continuar igualmente?',
              header: 'Confirmacion',
              acceptIcon:"none",
              acceptLabel: "Continuar",
              rejectIcon:"none",
              rejectButtonStyleClass:"p-button-text",
              accept: () => {
                  this.onSubmit();
                  this.loadingButton = false;
              },
              reject: () => {
                this.loadingButton = false;
                  return;
              }
          });
          } else {
            this.onSubmit();
            this.loadingButton = false;
          }
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error',
             detail: 'Se ha producido un error al intentar comprobar el numero de factura.', life: 3000 });
          this.loadingButton = false;
        }
      })
    // Comprobar si el numero de factura ya existe...
    
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

  onHideForm(): void {
    this.invoiceForm.reset();
  }
}
