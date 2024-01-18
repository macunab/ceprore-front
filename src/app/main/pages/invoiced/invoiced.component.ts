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

  invoicedOrders: Array<Invoice> = [
    {
      id: '1111', invoiceCode: 'RT-0001231', createAt: new Date(2023,8,22), invoiceDate: new Date(2023,8,15),
      paymentDeadline: 10, deliveryTerm: 15, ivaAmount: 300, invoicedAmount: 1300, remitAmount: 1300, total: 2900,
      order: {
        id: '1111', createAt: new Date(2020,8,15), code: 'ASD-324', status: 'Pendiente', total: 3369.6975,
      customer: {
        id: '1111', name: 'Carlo Juarez', address: 'San juan 1234', email: 'carlos@gmail.com', 
          discountsByFactory: [
            { factory: { id: '1111', name: 'Fabrica1', address: 'San juan 232', email: 'factory1@gmail.com'},
            delivery: { _id: '1111', name: 'Cruz Azul', address: 'San Martin 124', email: 'cruzAzul@viajes.com' },
            discounts: [5, 5], cascadeDiscount: 0.0975 },
            { factory: { id: '1212', name: 'Carilo SA', address: 'Suipacha 123', email: 'carilo@gmail.com' },
            delivery: { _id: '3333', name: 'Fedex Arg', address: 'Carlos Gardel 233', email: 'fedexArg@fedex.com'},
            discounts: [5], cascadeDiscount: 0.05 },
            { factory: { id: '2222', name: 'Sancor Productos', address: 'Ituzaingo 232', email: 'sancor@gmail.com' },
            delivery: { _id: '2222', name: 'Carlitos SA', address: 'Inigo de la pascua 123', email: 'carlitos@gmail.com' },
            discounts: [5], cascadeDiscount: 0.05 }
          ], priceList: { _id: '2222', name: 'Distribuidoras' }
      },
      priceList: { _id: '2222', name: 'Distribuidoras' }, 
      delivery: { _id: '2222', name: 'Carlitos SA', address: 'Inigo de la pascua 123', email: 'carlitos@gmail.com' },
      factory: { id: '2222', name: 'Sancor Productos', address: 'Ituzaingo 232', email: 'sancor@gmail.com', commission: 0.05 },
      observations: 'Se vendera la mitad por remito pero se retirara en fecha acordada. Sin envio la parte de remito.',
      cascadeDiscount: 5, invoicedPercent: { percentString: '50%', percentNumber: 0.5},
      productsCart: [
        { product: { id: '1111', code: 'CA-1231', name: 'Gallete Cracker', description: 'Galleta cracker multicereal Ceralmix. Fabrica Otonello',
        boxesPallet: 10, unitsBox: 24, factory: { id: '1111', name: 'factory1', address: 'asdasdasd', email: 'asas@gmail.com'},
        pricesByList: [{ list: { _id: '1111', name: 'Supermercados' }, price: 150 }, { list: {_id: '2222', name: 'Distribuidoras'}, price: 170 }] }, price: 170,
      quantity: 1, bonus: 0,subtotal: 170 },
      { product: { id: '2222', code: 'CA-1231', name: 'Confites de aniz', description: 'Galleta cracker multicereal Ceralmix. Fabrica Otonello',
      boxesPallet: 10, unitsBox: 24, factory: { id: '1111', name: 'factory1', address: 'asdasdasd', email: 'asas@gmail.com'},
      pricesByList: [{ list: { _id: '1111', name: 'Supermercados' }, price: 150 }, { list: {_id: '2222', name: 'Distribuidoras'}, price: 250 }] },
      price: 250, quantity: 10, bonus: 0, subtotal: 2500 },
      { product: { id: '4444', code: 'CA-1231', name: 'Chocolate aguila', description: 'Galleta cracker multicereal Ceralmix. Fabrica Otonello',
      boxesPallet: 10, unitsBox: 24, factory: { id: '1111', name: 'factory1', address: 'asdasdasd', email: 'asas@gmail.com'},
      pricesByList: [{ list: { _id: '1111', name: 'Supermercados' }, price: 150 }, { list: {_id: '2222', name: 'Distribuidoras'}, price: 540 }] },
      price: 540, quantity: 1, bonus: 0, subtotal: 540 }
      ], netTotal: 3210, netTotalWithDiscount: 3049.5, invoicedAmount: 1524.75, remitAmount: 1524.75, ivaAmount: 320.1975,
      discounts: [5, 5]
      }, isPaid: false
    }
  ];
  invoiceUpdate: Invoice = {} as Invoice;
  invoicePaid: Invoice = {} as Invoice;
  showInvoiceForm: boolean = false;
  showPaidForm: boolean = false;

  constructor(private confirmation: ConfirmationService, private message: MessageService) {}
  
  ngOnInit(): void {
    // get invoicedOrders from invoice service and set the variable
  }

  onAction(action: TableEvent<Invoice>): void {
    switch(action.type) {
      case 'edit':
        console.log('EDIT');
        this.edit(action.data);
      break;
      case 'delete':
        console.log('DELETE');
        this.delete(action.data);
      break;
      case 'print':
        console.log('PRINT');
      break;
      case 'paid':
        console.log('PAID');
        this.paid(action.data);
      break;
    }
  }

  edit(invoice: Invoice): void {
    this.invoiceUpdate = invoice;
    this.showInvoiceForm = true;
  }

  delete(invoice: Invoice): void {
    this.confirmation.confirm({
      message: 'Desea Eliminar la factura seleccionada?',
      header: 'Confirmar Eliminacion',
      icon: 'pi pi-info-delete',
      accept: () => {
        try {
          // delete invoice service (try)...
          // update order status from invoice to 'PENDING'... ('INVOICED' ==> 'PENDING')
          this.invoicedOrders = this.invoicedOrders.filter(value => value.id !== invoice.id);
          this.invoicedOrders = [...this.invoicedOrders];
          this.message.add({ severity: 'info', summary: 'Informacion', 
            detail: 'La factura se ha eliminado exisotamente'}); 
        } catch(error) {
          this.message.add({ severity: 'error', summary: 'ERROR!', 
            detail: 'Ha ocurrido un error al intentar eliminar la factura seleccionada!'});
        }
      }
    });
  }

  paid(invoice: Invoice): void {
    this.showPaidForm = true;
    this.invoicePaid = invoice;
  }

  onInvoiceFormSubmit(dialogData: DialogData<Invoice>): void {
    if(dialogData.data.id) {
      this.showInvoiceForm = false;
      try {
        // update invoice service
        const index = this.invoicedOrders.findIndex(value => value.id === dialogData.data.id);
        (index !== -1) ? this.invoicedOrders[index] = dialogData.data : '';
        this.invoicedOrders = [...this.invoicedOrders];
        this.message.add({ severity: 'info', summary: 'Informacion', 
          detail: 'Se ha editado una factura exitosamente.'})
      } catch(error) {
        this.message.add({ severity: 'error', summary: 'ERROR!', 
          detail: 'Ha ocurrido un error al intentar editar una factura existente!.'});
      }
    }
  }

  onPaidFormSubmit(dialogData: DialogData<Paid>): void {
    console.log(dialogData.data);
    if(dialogData.data.invoice.order.id) {
      try {
        dialogData.data.invoice.isPaid = true;
        // save paid.
        // update invoice (isPaid: true).
        // update order (status: PAID).
        this.invoicedOrders = this.invoicedOrders.filter(value => value.id !== dialogData.data.invoice.id);
        this.message.add({ severity:'info', summary: 'Informacion', 
          detail: 'Se ha cargado un pago exitosamente.'})
      } catch(error) {
        this.message.add({ severity: 'error', summary: 'ERROR!', 
          detail: 'Ha ocurrido un error al intentar crear un nuevo pago!.'});
      }
      this.showPaidForm = false;
    }
  }


}
