import { Component, OnInit } from '@angular/core';
import { Delivery } from '../../interfaces/delivery.interface';
import { ButtonConfig, Column, TableEvent } from '../../../shared/interfaces/genericTable.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GenericTableComponent } from '../../../shared/generic-table/generic-table.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DialogData } from '../../interfaces/dialogData.interface';
import { DeliveryFormDialogComponent } from '../../components/delivery-form-dialog/delivery-form-dialog.component';

@Component({
  selector: 'app-deliveries',
  standalone: true,
  imports: [GenericTableComponent, ConfirmDialogModule, ToastModule, DialogModule, 
    DeliveryFormDialogComponent],
  templateUrl: './deliveries.component.html',
  styleUrl: './deliveries.component.css',
  providers: [ConfirmationService, MessageService]
})
export class DeliveriesComponent implements OnInit{

  deliveries: Array<Delivery> = [
    { id: '1111', name: 'Cruz Azul', address: 'San Martin 124', email: 'cruzAzul@viajes.com' },
    { id: '2222', name: 'Carlitos SA', address: 'Inigo de la pascua 123', email: 'carlitos@gmail.com' },
    { id: '3333', name: 'Fedex Arg', address: 'Carlos Gardel 233', email: 'fedexArg@fedex.com'}
  ];
  showForm: boolean = false;
  buttons: Array<ButtonConfig> = [
    { class: 'p-button-sm p-button-info p-button-rounded p-button-text mr-2', functionType: 'edit', icon: 'pi pi-pencil', tooltipText: 'Editar' },
    { class: 'p-button-sm p-button-danger p-button-rounded p-button-text mr-2', functionType: 'delete', icon: 'pi pi-trash', tooltipText: 'Eliminar' }
  ];
  filters: Array<string> = ['name', 'email'];
  headers: Array<Column<Delivery>> = [
    { field: 'name', title: 'Nombre' },
    { field: 'address', title: 'Direccion' },
    { field: 'email', title: 'Correo' }
  ];
  deliveryUpdate: Delivery = {} as Delivery;
  formTitle: string = '';
  tableTitle: string = 'Transportes';

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService) {}
  
  ngOnInit(): void {
    console.info('Se cargan los deliveries existentes en la db');
  }

  onActions(action: TableEvent<Delivery>): void {
    switch(action.type) {
      case 'edit':
        this.editDelivery(action.data);
      break;
      case 'delete':
        this.deleteDelivery(action.data);
      break;
      case 'create':
        this.createDelivery();
      break;
    }
  }

  editDelivery(delivery: Delivery): void {
    this.formTitle = 'Editar Transporte';
    this.deliveryUpdate = delivery;
    this.showForm = true;
  }

  deleteDelivery(delivery: Delivery): void {
    this.confirmationService.confirm({
      message: `Desea eliminar el transporte: "${delivery.name}"?`,
      header: 'Confirmar Eliminacion',
      icon: 'pi pi-info-delete',
      accept: () => {
        try {
          // delete delivery service.. if ok then
          //throw new Error;
          this.deliveries = this.deliveries.filter(value => value.id !== delivery.id);
          this.messageService.add({ severity: 'info', summary: 'Informacion', 
            detail: `El transporte: "${delivery.name}", se ha eliminado exitosamente.`});
        } catch(error) {
          // save error in log
          this.messageService.add({ severity: 'error', summary: 'ERROR!', 
            detail: `Ha ocurrido un error al intentar eliminar el transporte: "${delivery.name}".`})
        }
      }
    })
  }

  createDelivery(): void {
    this.formTitle = 'Nueva Transporte';
    this.deliveryUpdate = {} as Delivery;
    this.showForm = true;
  }

  onFormClose(dialogData: DialogData<Delivery>): void {
    this.showForm = false;
    if(dialogData.data.id) {
      try {
        // update service
        const index = this.deliveries.findIndex( val => val.id === dialogData.data.id);
        (index !== -1) ? this.deliveries[index] = dialogData.data : '';
        this.deliveries = [ ...this.deliveries ];
        this.messageService.add({ severity: 'info', summary:'Informacion', 
          detail: `El transporte: "${dialogData.data.name}", fue modificado exitosamente`});
      } catch(error) {
        this.messageService.add({ severity: 'error', summary: 'ERROR!', 
          detail: `Ocurrio un error al intentar modificar el transporte: "${dialogData.data.name}"`});
      }
    } else {
      try {
        // create service
        dialogData.data.id = '33234234'; // only for tests
        this.deliveries.push(dialogData.data);
        this.deliveries = [...this.deliveries];
        this.messageService.add({ severity: 'info', summary: 'Informacion', 
          detail: `Se ha creado exitosamente el transporte: "${dialogData.data.name}"`});
      } catch(error) {
        this.messageService.add({ severity: 'error', summary: 'ERROR!', 
          detail: 'Ocurrio un error al intentar crear un nuevo transporte'});
      }
    }
  }



}
