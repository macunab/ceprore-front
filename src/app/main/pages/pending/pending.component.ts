import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Order } from '../../interfaces/order.interface';
import { TableEvent } from '../../../shared/interfaces/genericTable.interface';
import { PendingTableComponent } from '../../components/pending-table/pending-table.component';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InvoiceFormDialogComponent } from '../../components/invoice-form-dialog/invoice-form-dialog.component';
import { DialogData } from '../../interfaces/dialogData.interface';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [PendingTableComponent, ConfirmDialogModule, ToastModule, DialogModule, InvoiceFormDialogComponent],
  templateUrl: './pending.component.html',
  styleUrl: './pending.component.css',
  providers: [ConfirmationService, MessageService]
})
export class PendingComponent implements OnInit{
  
  pendingOrders: Array<Order> = [];
  orderUpdate: Order = {} as Order;
  showInvoiceForm: boolean = false;
  loadingTable: boolean = true;
  loadingButton: boolean = false;

  constructor(private confirmation: ConfirmationService, private message: MessageService,
      private router: Router, private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.findAll('STARTED')
      .subscribe({
        next: res => {
          this.pendingOrders = res;
          this.loadingTable = false;
        },
        error: () => {
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
        error: () => {
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
        this.orderService.delete(order._id!)
          .subscribe({
            next: res => {
              this.pendingOrders = this.pendingOrders.filter(val => val._id !== res._id);
              this.pendingOrders = [...this.pendingOrders];
              this.message.add({ severity: 'success', summary: 'Informacion',
                detail: 'El Pedido ha sido eliminado exitosamente.'});
            },
            error: () => {
              this.message.add({ severity: 'error', summary: 'ERROR!',
                detail: 'Ha ocurrido un error al intentar eliminar un Pedido pendiente.'});
            }
          });
      }
    });
  }

  createOrder(): void {
    this.router.navigateByUrl('main/pending-order');
  }

  // Facturacion de Pedido Pendiente.
  onDialogClose(dialogData: DialogData<Order>): void {

    this.loadingButton = true;
    const { __v, createdAt, updatedAt, ...order } = dialogData.data;
      this.orderService.update(order)
        .subscribe({
          next: res => {
            this.pendingOrders = this.pendingOrders.filter( val => val._id !== res._id)
            this.pendingOrders = [...this.pendingOrders];
            this.message.add({ severity: 'success', summary: 'Informacion',
              detail: 'El Pedido ha sido Facturado exitosamente.'});
            this.showInvoiceForm = false;
            this.loadingButton = false;
          },
          error: () => {
            this.message.add({ severity: 'error', summary: 'ERROR!',
              detail: 'Ha ocurrido un error al intentar crear una nueva Factura'});
            this.loadingButton = false;
          }
        });
  }
}
