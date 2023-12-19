import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Order } from '../../interfaces/order.interface';
import { ButtonConfig, Column, TableEvent } from '../../../shared/interfaces/genericTable.interface';
import { PendingTableComponent } from '../../components/pending-table/pending-table.component';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [PendingTableComponent, ConfirmDialogModule, ToastModule],
  templateUrl: './pending.component.html',
  styleUrl: './pending.component.css',
  providers: [ConfirmationService, MessageService]
})
export class PendingComponent implements OnInit{
  
  pendingOrders: Array<Order> = [
    { id: '1111', createAt: new Date(2020,8,15), code: 'ASD-324', status: 'Pendiente', total: 1234,
      customer: {id: '2222', name: 'Juan Garcias', address: 'Simon Bolivar 221', email: 'juan@gmail.com'},
      factory: { id: '2222', name: 'Sancor Productos', address: 'Ituzaingo 232', email: 'sancor@gmail.com' }}
  ];
  orderUpdate: Order = {} as Order;
  formTitle: string = '';
  showForm: boolean = false;

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
  }

  editOrder(order: Order): void {

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
