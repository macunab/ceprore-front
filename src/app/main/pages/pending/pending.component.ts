import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Order } from '../../interfaces/order.interface';
import { ButtonConfig, Column, TableEvent } from '../../../shared/interfaces/genericTable.interface';
import { PendingTableComponent } from '../../components/pending-table/pending-table.component';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InvoiceFormDialogComponent } from '../../components/invoice-form-dialog/invoice-form-dialog.component';
import { DialogData } from '../../interfaces/dialogData.interface';
import { Invoice } from '../../interfaces/invoice.interface';
import { OrderService } from '../../services/order.service';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [PendingTableComponent, ConfirmDialogModule, ToastModule, DialogModule, InvoiceFormDialogComponent],
  templateUrl: './pending.component.html',
  styleUrl: './pending.component.css',
  providers: [ConfirmationService, MessageService]
})
export class PendingComponent implements OnInit{
  
  pendingOrders: Array<Order> = [
    { _id: '1111', createdAt: new Date(2020,8,15), code: 'ASD-324', status: 'Pendiente', total: 3369.6975,
      customer: {
        _id: '1111', name: 'Carlo Juarez', address: 'San juan 1234', email: 'carlos@gmail.com', 
          discountsByFactory: [
            { factory: { _id: '1111', name: 'Fabrica1', address: 'San juan 232', email: 'factory1@gmail.com'},
            delivery: { _id: '1111', name: 'Cruz Azul', address: 'San Martin 124', email: 'cruzAzul@viajes.com' },
            discounts: [5, 5], cascadeDiscount: 0.0975 },
            { factory: { _id: '1212', name: 'Carilo SA', address: 'Suipacha 123', email: 'carilo@gmail.com' },
            delivery: { _id: '3333', name: 'Fedex Arg', address: 'Carlos Gardel 233', email: 'fedexArg@fedex.com'},
            discounts: [5], cascadeDiscount: 0.05 },
            { factory: { _id: '2222', name: 'Sancor Productos', address: 'Ituzaingo 232', email: 'sancor@gmail.com' },
            delivery: { _id: '2222', name: 'Carlitos SA', address: 'Inigo de la pascua 123', email: 'carlitos@gmail.com' },
            discounts: [5], cascadeDiscount: 0.05 }
          ], priceList: { _id: '2222', name: 'Distribuidoras' }
      },
      priceList: { _id: '2222', name: 'Distribuidoras' }, 
      delivery: { _id: '2222', name: 'Carlitos SA', address: 'Inigo de la pascua 123', email: 'carlitos@gmail.com' },
      factory: { _id: '2222', name: 'Sancor Productos', address: 'Ituzaingo 232', email: 'sancor@gmail.com' },
      observations: 'Se vendera la mitad por remito pero se retirara en fecha acordada. Sin envio la parte de remito.',
      cascadeDiscount: 5, invoicedPercent: { percentString: '50%', percentNumber: 0.5},
      productsCart: [
        { product: { _id: '1111', code: 'CA-1231', name: 'Gallete Cracker', description: 'Galleta cracker multicereal Ceralmix. Fabrica Otonello',
        boxesPerPallet: 10, unitsPerBox: 24, factory: { _id: '1111', name: 'factory1', address: 'asdasdasd', email: 'asas@gmail.com'},
        pricesByList: [{ priceList: { _id: '1111', name: 'Supermercados' }, price: 150 }, { priceList: {_id: '2222', name: 'Distribuidoras'}, price: 170 }] }, price: 170,
      quantity: 1, bonus: 0,subtotal: 170 },
      { product: { _id: '2222', code: 'CA-1231', name: 'Confites de aniz', description: 'Galleta cracker multicereal Ceralmix. Fabrica Otonello',
      boxesPerPallet: 10, unitsPerBox: 24, factory: { _id: '1111', name: 'factory1', address: 'asdasdasd', email: 'asas@gmail.com'},
      pricesByList: [{ priceList: { _id: '1111', name: 'Supermercados' }, price: 150 }, { priceList: {_id: '2222', name: 'Distribuidoras'}, price: 250 }] },
      price: 250, quantity: 10, bonus: 0, subtotal: 2500 },
      { product: { _id: '4444', code: 'CA-1231', name: 'Chocolate aguila', description: 'Galleta cracker multicereal Ceralmix. Fabrica Otonello',
      boxesPerPallet: 10, unitsPerBox: 24, factory: { _id: '1111', name: 'factory1', address: 'asdasdasd', email: 'asas@gmail.com'},
      pricesByList: [{ priceList: { _id: '1111', name: 'Supermercados' }, price: 150 }, { priceList: {_id: '2222', name: 'Distribuidoras'}, price: 540 }] },
      price: 540, quantity: 1, bonus: 0, subtotal: 540 }
      ], netTotal: 3210, netTotalWithDiscount: 3049.5, invoicedAmount: 1524.75, remitAmount: 1524.75, ivaAmount: 320.1975,
      discounts: [5, 5]
    },
  ];
  orderUpdate: Order = {} as Order;
  showInvoiceForm: boolean = false;

  constructor(private confirmation: ConfirmationService, private message: MessageService,
      private router: Router, private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.findAll('STARTED')
      .subscribe({
        next: res => {
          this.pendingOrders = res;
        },
        error: err => {
          console.log(err);
          this.message.add({ severity: 'error', summary: 'ERROR!',
            detail: 'Ha ocurrido un erro al intentar obtener todos los Pedidos Pendientes.'});
        }
      })
    
  }

  onAction(action: TableEvent<Order>): void {
    switch(action.type) {
      case 'print':
        this.printOrder(action.data);
      break;
      case 'invoiced':
        this.invoicedOrder(action.data);
      break;
      case 'edit':
        this.editOrder(action.data);
      break;
      case 'delete':
        this.deleteOrder(action.data);
      break;
      case 'create':
        this.createOrder();
      break;
    }
  }

  printOrder(order: Order): void {
    this.orderService.printPending(order)
      .subscribe({
        next: res => {
          let blob = new Blob([res], { type: 'application/pdf' });
          let pdfUrl = window.URL.createObjectURL(blob);
          window.open(pdfUrl, '_blank');
        },
        error: err => {
          console.log(err);
          this.message.add({ severity: 'error', summary: 'ERROR!',
            detail: 'Ha ocurrido un erro al intentar imprimir el Pedido.'});
        }
      });
  }

  invoicedOrder(order: Order): void {
    this.orderUpdate = order;
    this.showInvoiceForm = true;
  }

  editOrder(order: Order): void {
    this.router.navigateByUrl('main/pending-order', { state: order });
  }

  deleteOrder(order: Order): void {
    this.confirmation.confirm({
      message: 'Desea eliminar el pedido seleccionado?',
      header: 'Confirmar Eliminacion',
      icon: 'pi pi-info-delete',
      accept: () => {
        try {
          // delete order service... only Pending
          this.pendingOrders = this.pendingOrders.filter(value => value._id !== order._id);
          this.message.add({severity: 'info', summary: 'Informacion',
            detail: 'El pedido se ha eliminado exitosamente!'});
        } catch(error) {
          this.message.add({severity: 'error', summary: 'ERROR!', 
            detail: 'Ha ocurrido un error al intentar eliminar el pedido seleccionado!!'});
        }
      }
    });
  }

  createOrder(): void {
    this.router.navigateByUrl('main/pending-order');
  }

  onDialogClose(dialogData: DialogData<Order>): void {
    this.showInvoiceForm = false;
    // Aca hay que hacer 2 cosas: 1)create al invoice 2) si esta todo ok -> update al order con status: 'INVOICED'
    try {
      // service Create invoice/ service Update order (status)
      // si todo sale bien tengo que dejar de mostrar el pedido, puesto que ya no va a estar pendiente.
      this.pendingOrders = this.pendingOrders.filter( value => value._id !== dialogData.data._id);
      this.pendingOrders = [...this.pendingOrders];
      this.message.add({ severity: 'info', summary: 'Informacion',
        detail: 'El pedido ha sido facturado exitosamente.'}); 
    } catch(error) {
      this.message.add({severity: 'error', summary: 'ERROR', 
        detail: 'Ha ocurrido un error al intentar crear una nueva factura.'});
    }
  }

}
