import { Component, OnInit } from '@angular/core';
import { Invoice } from '../../interfaces/invoice.interface';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableEvent } from '../../../shared/interfaces/genericTable.interface';
import { DialogData } from '../../interfaces/dialogData.interface';
import { Paid } from '../../interfaces/paid.interface';
import { InvoiceTableComponent } from '../../components/invoice-table/invoice-table.component';
import { InvoiceFormDialogComponent } from '../../components/invoice-form-dialog/invoice-form-dialog.component';
import { PaidFormDialogComponent } from '../../components/paid-form-dialog/paid-form-dialog.component';
import { OrderService } from '../../services/order.service';
import { Order } from '../../interfaces/order.interface';

@Component({
  selector: 'app-invoiced',
  standalone: true,
  imports: [ConfirmDialogModule, ToastModule, DialogModule, InvoiceTableComponent, InvoiceFormDialogComponent,
    PaidFormDialogComponent],
  templateUrl: './invoiced.component.html',
  styleUrl: './invoiced.component.css',
  providers: [ConfirmationService, MessageService]
})
export class InvoicedComponent implements OnInit{

  invoicedOrders: Array<Order> = [];
  orderUpdate: Order = {} as Order;
  orderPaid: Order = {} as Order;
  showInvoiceForm: boolean = false;
  showPaidForm: boolean = false;

  constructor(private confirmation: ConfirmationService, private message: MessageService, 
      private orderService: OrderService) {}
  
  ngOnInit(): void {
    this.orderService.findAll('INVOICED')
      .subscribe({
        next: res => {
          this.invoicedOrders = res;
        },
        error: () => {
          this.message.add({ severity: 'error', summary: 'ERROR!',
            detail: 'Ha ocurrido un error al intentar obtener todos los Pedidos Facturados.'});
        }
      });
  }

  onAction(action: TableEvent<Order>): void {
    switch(action.type) {
      case 'edit':
        this.edit(action.data);
      break;
      case 'delete':
        this.delete(action.data);
      break;
      case 'print':
        this.print(action.data);
      break;
      case 'paid':
        this.paid(action.data);
      break;
    }
  }

  edit(order: Order): void {
    this.orderUpdate = order;
    this.showInvoiceForm = true;
  }

  delete(order: Order): void {
    this.confirmation.confirm({
      message: 'Desea Eliminar la factura seleccionada?',
      header: 'Confirmar Eliminacion',
      icon: 'pi pi-info-delete',
      accept: () => {
        const { createdAt, updatedAt, __v, ...updatedOrder } = order;
        updatedOrder.status = 'STARTED';
        this.orderService.removeInvoice(updatedOrder)
          .subscribe({
            next: res => {
              this.invoicedOrders = this.invoicedOrders.filter(val => val._id !== res._id);
              this.invoicedOrders = [...this.invoicedOrders];
              this.message.add({ severity: 'success', summary: 'Informacion',
                detail: 'Se ha eliminado la Factura exitosamente.'});
            },
            error: () => {
              this.message.add({ severity: 'error', summary: 'ERROR',
                detail: 'Ha ocurrido un error al intentar eliminar la Factura.'});
            }
          });
      }
    });
  }

  paid(order: Order): void {
    this.showPaidForm = true;
    this.orderPaid = order;
  }

  // Edit Invoice Form Submit
  onInvoiceFormSubmit(dialogData: DialogData<Order>): void {

    const { __v, createdAt, updatedAt, ...orderUpdate } = dialogData.data;
    this.orderService.update(orderUpdate)
      .subscribe({
        next: res => {
          const index = this.invoicedOrders.findIndex(val => val._id === res._id);
          (index !== -1) ? this.invoicedOrders[index] = res : '';
          this.invoicedOrders = [...this.invoicedOrders];
          this.message.add({ severity: 'success', summary: 'Informacion',
            detail: 'La Factura ha sido modificada exitosamente.'});
        },
        error: () => {
          this.message.add({ severity: 'error', summary: 'ERROR!',
            detail: 'Ha ocurrido un error al intentar modificar una Factura.'});
        }
      });
      this.showInvoiceForm = false;
  }

  onPaidFormSubmit(dialogData: DialogData<Order>): void {
    const { __v, createdAt, updatedAt, ...orderData } = dialogData.data;
    this.orderService.update(orderData)
      .subscribe({
        next: res => {
          this.invoicedOrders = this.invoicedOrders.filter(val => val._id !== res._id);
          this.invoicedOrders = [...this.invoicedOrders];
          this.message.add({ severity: 'success', summary: 'Informacion',
            detail: 'Se ha creado un Pago exitosamente.'});
        },
        error: () => {
          this.message.add({ severity: 'error', summary: 'ERROR!',
            detail: 'Ha ocurrido un error al intentar crear un Pago.'});
        }
      });
      this.showPaidForm = false;
  }

  print(order: Order): void {
    this.orderService.printInvoice(order)
      .subscribe({
        next: res => {
          let blob = new Blob([res], { type: 'application/pdf' });
          let pdfUrl = window.URL.createObjectURL(blob);
          window.open(pdfUrl, '_blank');
        },
        error: () => {
          this.message.add({ severity: 'error', summary: 'ERROR!',
            detail: 'Ha ocurrido un erro al intentar de imprimir una Factura.'});
        }
      });
  }
}
