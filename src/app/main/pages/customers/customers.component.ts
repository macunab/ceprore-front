import { Component, OnInit } from '@angular/core';
import { Customer } from '../../interfaces/customer.interface';
import { ButtonConfig, Column, TableEvent } from '../../../shared/interfaces/genericTable.interface';
import { GenericTableComponent } from '../../../shared/generic-table/generic-table.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit{

  customers: Array<Customer> = [
    { id: '1111', name: 'Carlo Juarez', address: 'San juan 1234', email: 'carlos@gmail.com'},
    { id: '2222', name: 'Juan Garcias', address: 'Simon Bolivar 221', email: 'juan@gmail.com'}
  ];
  buttons: Array<ButtonConfig> = [
    { class: 'p-button-sm p-button-info p-button-rounded p-button-text mr-2', functionType: 'edit', icon: 'pi pi-pencil', tooltipText: 'Editar' },
    { class: 'p-button-sm p-button-danger p-button-rounded p-button-text mr-2', functionType: 'delete', icon: 'pi pi-trash', tooltipText: 'Eliminar' }
  ];
  filters: Array<string> = ['name', 'email'];
  headers: Array<Column<Customer>> = [
    { field: 'name', title: 'Nombre' },
    { field: 'email', title: 'Correo' },
    { field: 'address', title: 'Direccion' }
  ];

  constructor() {}

  ngOnInit(): void {}

  onActions(action: TableEvent<Customer>): void {
    switch(action.type) {
      case 'edit':
        console.log('EDIT');
      break;
      case 'delete':
        console.log('DELETE');
      break;
      case 'create':
        console.log('CREATE');
      break;
    }
  }





}
