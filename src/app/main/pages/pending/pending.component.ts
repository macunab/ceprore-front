import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Order } from '../../interfaces/order.interface';
import { ButtonConfig, Column } from '../../../shared/interfaces/genericTable.interface';

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [],
  templateUrl: './pending.component.html',
  styleUrl: './pending.component.css',
  providers: [ConfirmationService, MessageService]
})
export class PendingComponent implements OnInit{
  
  pendingOrders: Array<Order> = [];
  orderUpdate: Order = {} as Order;
  buttons: Array<ButtonConfig> = [
    { class: 'p-button-sm p-button-secondary p-button-rounded p-button-text mr-2', 
        functionType: 'print', icon: 'pi pi-print', tooltipText: 'Imprimir' },
    { class: 'p-button-sm p-button-help p-button-rounded p-button-text mr-2', 
        functionType: 'invoiced', icon: 'pi pi-ticket', tooltipText: 'Facturar' },
    { class: 'p-button-sm p-button-info p-button-rounded p-button-text mr-2', 
        functionType: 'edit', icon: 'pi pi-pencil', tooltipText: 'Editar' },
    { class: 'p-button-sm p-button-danger p-button-rounded p-button-text mr-2', 
        functionType: 'delete', icon: 'pi pi-trash', tooltipText: 'Eliminar' }
  ];
  filters: Array<string> = ['code', 'status'];
  headers: Array<Column<Order>> = [
    { field: 'code', title: 'Codigo' },
    { field: 'status', title: 'Estado' }
  ];
  tableTitle: string = 'Pendientes';
  formTitle: string = '';
  showForm: boolean = false;


  constructor(private confirmation: ConfirmationService, private message: MessageService) {}

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }



}
