import { Component, OnInit } from '@angular/core';
import { Customer } from '../../interfaces/customer.interface';
import { ButtonConfig, Column, TableEvent } from '../../../shared/interfaces/genericTable.interface';
import { GenericTableComponent } from '../../../shared/generic-table/generic-table.component';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [GenericTableComponent, ConfirmDialogModule, ToastModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
  providers: [ConfirmationService, MessageService]
})
export class CustomersComponent implements OnInit{

  customers: Array<Customer> = [
    { id: '1111', name: 'Carlo Juarez', address: 'San juan 1234', email: 'carlos@gmail.com', 
      discountsByFactory: [
        { factory: { _id: '1111', name: 'Fabrica1', address: 'San juan 232', email: 'factory1@gmail.com'},
        delivery: { _id: '232323', name: 'Transporte1', address: 'Felipe boero 23', email: 'transporte1@gmail.com'},
        discounts: [5, 5], cascadeDiscount: 0.0975}
      ]},
    { id: '2222', name: 'Juan Garcias', address: 'Simon Bolivar 221', email: 'juan@gmail.com'}
  ];
  buttons: Array<ButtonConfig> = [
    { class: 'p-button-sm p-button-info p-button-rounded p-button-text mr-2', functionType: 'edit', icon: 'pi pi-pencil', tooltipText: 'Editar' },
    { class: 'p-button-sm p-button-danger p-button-rounded p-button-text mr-2', functionType: 'delete', icon: 'pi pi-trash', tooltipText: 'Eliminar' }
  ];
  filters: Array<string> = ['name', 'email', 'address'];
  headers: Array<Column<Customer>> = [
    { field: 'name', title: 'Nombre' },
    { field: 'email', title: 'Correo' },
    { field: 'address', title: 'Direccion' }
  ];
  tableTitle: string = 'Clientes';

  constructor(private router: Router, private confirmationService: ConfirmationService, 
      private messageService: MessageService) {}

  ngOnInit(): void {}

  onActions(action: TableEvent<Customer>): void {
    switch(action.type) {
      case 'edit':
        console.log('EDIT');
        this.router.navigateByUrl('main/customer', { state: action.data });
      break;
      case 'delete':
        console.log('DELETE');
        this.deleteCustomer(action.data);
      break;
      case 'create':
        console.log('CREATE EDIT');
        this.router.navigateByUrl('main/customer');
      break;
    }
  }

  deleteCustomer(customer: Customer) {
    this.confirmationService.confirm({
      message: `Desea eliminar el cliente: ${customer.name}`,
      header: 'Confirmar Eliminacion',
      icon: 'pi pi-info-delete',
      accept: () => {
        // try/catch delete customer service if ok ...
        this.customers = this.customers.filter(val => val.id !== customer.id);
        this.messageService.add({ severity: 'info', summary: 'Informacion', 
          detail: `El cliente: "${customer.name}", se ha eliminado exitosamente`});
      }
    })
  }

}
