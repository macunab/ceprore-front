import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Order } from '../../interfaces/order.interface';
import { ButtonConfig, Column, TableEvent } from '../../../shared/interfaces/genericTable.interface';
import { PendingTableComponent } from '../../components/pending-table/pending-table.component';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [PendingTableComponent, ConfirmDialogModule, ToastModule, DialogModule],
  templateUrl: './pending.component.html',
  styleUrl: './pending.component.css',
  providers: [ConfirmationService, MessageService]
})
export class PendingComponent implements OnInit{
  
  pendingOrders: Array<Order> = [
    { id: '1111', createAt: new Date(2020,8,15), code: 'ASD-324', status: 'Pendiente', total: 3369.6975,
      customer: {
        id: '1111', name: 'Carlo Juarez', address: 'San juan 1234', email: 'carlos@gmail.com', 
          discountsByFactory: [
            { factory: { id: '1111', name: 'Fabrica1', address: 'San juan 232', email: 'factory1@gmail.com'},
            delivery: { id: '1111', name: 'Cruz Azul', address: 'San Martin 124', email: 'cruzAzul@viajes.com' },
            discounts: [5, 5], cascadeDiscount: 0.0975 },
            { factory: { id: '1212', name: 'Carilo SA', address: 'Suipacha 123', email: 'carilo@gmail.com' },
            delivery: { id: '3333', name: 'Fedex Arg', address: 'Carlos Gardel 233', email: 'fedexArg@fedex.com'},
            discounts: [5], cascadeDiscount: 0.05 },
            { factory: { id: '2222', name: 'Sancor Productos', address: 'Ituzaingo 232', email: 'sancor@gmail.com' },
            delivery: { id: '2222', name: 'Carlitos SA', address: 'Inigo de la pascua 123', email: 'carlitos@gmail.com' },
            discounts: [5], cascadeDiscount: 0.05 }
          ], priceList: { id: '2222', name: 'Distribuidoras' }
      },
      priceList: { id: '2222', name: 'Distribuidoras' }, 
      delivery: { id: '2222', name: 'Carlitos SA', address: 'Inigo de la pascua 123', email: 'carlitos@gmail.com' },
      factory: { id: '2222', name: 'Sancor Productos', address: 'Ituzaingo 232', email: 'sancor@gmail.com' },
      observations: 'Se vendera la mitad por remito pero se retirara en fecha acordada. Sin envio la parte de remito.',
      cascadeDiscount: 5, invoicedPercent: { percentString: '50%', percentNumber: 0.5},
      productsCart: [
        { product: { id: '1111', code: 'CA-1231', name: 'Gallete Cracker', description: 'Galleta cracker multicereal Ceralmix. Fabrica Otonello',
        boxesPallet: 10, unitsBox: 24, factory: { id: '1111', name: 'factory1', address: 'asdasdasd', email: 'asas@gmail.com'},
        pricesByList: [{ list: { id: '1111', name: 'Supermercados' }, price: 150 }, { list: {id: '2222', name: 'Distribuidoras'}, price: 170 }] }, price: 170,
      quantity: 1, bonus: 0,subtotal: 170 },
      { product: { id: '2222', code: 'CA-1231', name: 'Confites de aniz', description: 'Galleta cracker multicereal Ceralmix. Fabrica Otonello',
      boxesPallet: 10, unitsBox: 24, factory: { id: '1111', name: 'factory1', address: 'asdasdasd', email: 'asas@gmail.com'},
      pricesByList: [{ list: { id: '1111', name: 'Supermercados' }, price: 150 }, { list: {id: '2222', name: 'Distribuidoras'}, price: 250 }] },
      price: 250, quantity: 10, bonus: 0, subtotal: 2500 },
      { product: { id: '4444', code: 'CA-1231', name: 'Chocolate aguila', description: 'Galleta cracker multicereal Ceralmix. Fabrica Otonello',
      boxesPallet: 10, unitsBox: 24, factory: { id: '1111', name: 'factory1', address: 'asdasdasd', email: 'asas@gmail.com'},
      pricesByList: [{ list: { id: '1111', name: 'Supermercados' }, price: 150 }, { list: {id: '2222', name: 'Distribuidoras'}, price: 540 }] },
      price: 540, quantity: 1, bonus: 0, subtotal: 540 }
      ], netTotal: 3210, netTotalWithDiscount: 3049.5, invoicedAmount: 1524.75, remitAmount: 1524.75, ivaAmount: 320.1975,
      discounts: [5, 5]
    },
  ];
  orderUpdate: Order = {} as Order;
  showInvoiceForm: boolean = false;

  constructor(private confirmation: ConfirmationService, private message: MessageService,
      private router: Router) {}

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
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
    // print order service...
    console.log('Se solicitara la ruta de implesion enviando la orden solicitada al backend...');
    console.table(order);
  }

  invoicedOrder(order: Order): void {
    // router to the invoicedForm or open a modal with the form
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
          this.pendingOrders = this.pendingOrders.filter(value => value.id !== order.id);
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
    // console.info('Create Order');
    this.router.navigateByUrl('main/pending-order');
  }



}
