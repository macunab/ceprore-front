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
import { DeliveryService } from '../../services/delivery.service';

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
    { _id: '1111', name: 'Cruz Azul', address: 'San Martin 124', email: 'cruzAzul@viajes.com' },
    { _id: '2222', name: 'Carlitos SA', address: 'Inigo de la pascua 123', email: 'carlitos@gmail.com' },
    { _id: '3333', name: 'Fedex Arg', address: 'Carlos Gardel 233', email: 'fedexArg@fedex.com'}
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

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService,
    private deliveryService: DeliveryService) {}
  
  ngOnInit(): void {
    console.info('Se cargan los deliveries existentes en la db');
    this.deliveryService.findAll()
      .subscribe({
        next: (res) => {
          this.deliveries = res;
        },
        error: () => {
          this.messageService.add({severity: 'error', summary: 'ERROR!',
            detail: 'Ha ocurrido un error al intentar obtener todos los transportes del sistema'});
        }
      });
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
        this.deliveryService.delete(delivery._id!)
          .subscribe({
            next: (res) => {
              this.deliveries = this.deliveries.filter(value => value._id !== res._id);
              this.messageService.add({severity: 'success', summary: 'Informacion',
                detail: `El transporte: "${res.name}", se ha eliminado exitosamente.`})
            },
            error: () => {
              this.messageService.add({ severity: 'error', summary: 'ERROR!',
                detail: `Ha ocurrido un error al intentar eliminar el Transporte: "${delivery.name}".`});
            }
          });
      }
    })
  }

  createDelivery(): void {
    this.formTitle = 'Nuevo Transporte';
    this.deliveryUpdate = {} as Delivery;
    this.showForm = true;
  }

  onFormClose(dialogData: DialogData<Delivery>): void {
    this.showForm = false;
    if(dialogData.data._id) {
      this.deliveryService.update(dialogData.data)
        .subscribe({
          next: (res) => {
            const index = this.deliveries.findIndex(val => val._id === res._id);
            (index != -1) ? this.deliveries[index] = res : '';
            this.deliveries = [...this.deliveries];
            this.messageService.add({ severity: 'success', summary: 'Informacion',
              detail: `El Transporte: "${res.name}", fue modificado exitosamente`});
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'ERROR!',
              detail: `Ha ocurrido un error al intentar editar el Transporte: "${dialogData.data.name}"`});
          }
        });
    } else {
      this.deliveryService.create(dialogData.data)
        .subscribe({
          next: (res) => {
            this.deliveries.push(res);
            this.deliveries = [...this.deliveries];
            this.messageService.add({severity: 'success', summary: 'Informacion',
              detail: `Se ha creado exitosamente el transporte: "${res.name}"`});
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'ERROR!',
              detail: 'Ha ocurrido un error al intentar crear un nuevo Transporte'});
          }
        });
    }
  }
}
