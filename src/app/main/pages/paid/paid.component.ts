import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { PaidTableComponent } from '../../components/paid-table/paid-table.component';
import { PaidFormDialogComponent } from '../../components/paid-form-dialog/paid-form-dialog.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableEvent } from '../../../shared/interfaces/genericTable.interface';
import { DialogData } from '../../interfaces/dialogData.interface';
import { Order } from '../../interfaces/order.interface';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-paid',
  standalone: true,
  imports: [ConfirmDialogModule, ToastModule, DialogModule, PaidTableComponent, PaidFormDialogComponent],
  templateUrl: './paid.component.html',
  styleUrl: './paid.component.css',
  providers: [ConfirmationService, MessageService]
})
export class PaidComponent implements OnInit{

  paidOrders: Array<Order> = [];
  showForm: boolean = false;
  paymentUpdate: Order = {} as Order;
  @ViewChild(PaidFormDialogComponent) formDialog!: PaidFormDialogComponent;
  
  constructor(private confirmation: ConfirmationService, private message: MessageService,
    private orderService: OrderService) {}
  
  ngOnInit(): void {
    this.orderService.findAll('PAID')
      .subscribe({
        next: res => {
          this.paidOrders = res;
        },
        error: () => {
          this.message.add({ severity: 'error', summary: 'ERROR!',
            detail: 'Ha ocurrido un error al intentar obtener todos los Pedidos Pagos.'})
        }
      });
  }

  onAction(action: TableEvent<Order>): void {
    switch(action.type) {
      case 'edit':
        this.paymentUpdate = action.data;
        this.showForm = true;
      break;
      case 'surrender':
        this.onSurrender(action.data);
      break;
      case 'delete':
        this.onDelete(action.data);
      break;
    }
  }

  onDelete(order: Order): void {
    this.confirmation.confirm({
      header: 'Confirmar Eliminacion',
      message: 'Desea eliminar el pago seleccionado?',
      accept: () => {
        const { __v, createdAt, updatedAt, ...orderData } = order;
        orderData.status = 'INVOICED';
        this.orderService.removePayment(orderData)
          .subscribe({
            next: res => {
              this.paidOrders = this.paidOrders.filter(val => val._id !== res._id);
              this.paidOrders = [...this.paidOrders];
              this.message.add({ severity: 'success', summary: 'Informacion',
                detail: 'El Pago se ha eliminado exitosamente.'});
            },
            error: () => {
              this.message.add({ severity: 'error', summary: 'ERROR!',
                detail: 'Ha ocurrido un erro al intentar eliminar un Pago.'});
            }
          });
      }
    });
  }

  onSurrender(order: Order): void {
    this.confirmation.confirm({
      header: 'Confirmar Rendicion',
      message: 'Desea habilitar el Pago para rendicion?',
      accept: () => {
        const { __v, createdAt, updatedAt, ...orderData } = order;
        orderData.status = 'SURRENDER';
        this.orderService.update(orderData)
          .subscribe({
            next: res => {
              this.paidOrders = this.paidOrders.filter(val => val._id !== res._id);
              this.paidOrders = [...this.paidOrders];
              this.message.add({ severity: 'success', summary: 'Informacion',
                detail: 'El Pago se a rendido exitosamente.'});
            },
            error: () => {
              this.message.add({ severity: 'error', summary: 'ERROR!',
                detail: 'Ha ocurrido un erro al intentar rendir el Pago.'});
            }
          });
      }
    });
  }

  onPaidFormSubmit(dialogData: DialogData<Order>): void {

    const { __v, createdAt, updatedAt, ...orderData } = dialogData.data;
    this.orderService.update(orderData)
      .subscribe({
        next: res => {
          const index = this.paidOrders.findIndex(val => val._id === res._id);
          (index !== -1) ? this.paidOrders[index] = res : '';
          this.paidOrders = [...this.paidOrders];
          this.message.add({ severity: 'success', summary: 'Informacion',
            detail: 'El Pago se a modificado exitosamente.'});
        }, 
        error: () => {
          this.message.add({ severity: 'error', summary: 'ERROR!',
            detail: 'Ha ocurrido un error al intentar modificar el Pago.'});
        }
      });
    this.showForm = false;
  }
}
