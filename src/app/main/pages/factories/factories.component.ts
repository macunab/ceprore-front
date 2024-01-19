import { Component, OnInit } from '@angular/core';
import { GenericTableComponent } from '../../../shared/generic-table/generic-table.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Factory } from '../../interfaces/factory.interface';
import { ButtonConfig, Column, TableEvent } from '../../../shared/interfaces/genericTable.interface';
import { DialogModule } from 'primeng/dialog';
import { FactoryFormDialogComponent } from '../../components/factory-form-dialog/factory-form-dialog.component';
import { DialogData } from '../../interfaces/dialogData.interface';
import { FactoryService } from '../../services/factory.service';

@Component({
  selector: 'app-factories',
  standalone: true,
  imports: [GenericTableComponent, ConfirmDialogModule, ToastModule, DialogModule, 
    FactoryFormDialogComponent],
  templateUrl: './factories.component.html',
  styleUrl: './factories.component.css',
  providers: [ConfirmationService, MessageService]
})
export class FactoriesComponent implements OnInit {

  factories: Array<Factory> = [
    { _id: '1111', name: 'Carilo SA', address: 'Suipacha 123', email: 'carilo@gmail.com' },
    { _id: '2222', name: 'Sancor Productos', address: 'Ituzaingo 232', email: 'sancor@gmail.com' },
    { _id: '3333', name: 'Holidays SA', address: 'Olaen 232', email: 'holidays@gmail.com' },
    { _id: '4444', name: 'Arcor', address: 'Ruta 2 232', email: 'arcor@gmail.com' }
  ];
  buttons: Array<ButtonConfig> = [
    { class: 'p-button-sm p-button-info p-button-rounded p-button-text mr-2', functionType: 'edit', icon: 'pi pi-pencil', tooltipText: 'Editar' },
    { class: 'p-button-sm p-button-danger p-button-rounded p-button-text mr-2', functionType: 'delete', icon: 'pi pi-trash', tooltipText: 'Eliminar' }
  ];
  filters: Array<string> = ['name', 'address', 'email'];
  headers: Array<Column<Factory>> = [
    { field: 'name', title: 'Nombre' },
    { field: 'address', title: 'Direccion' },
    { field: 'email', title: 'Correo' }
  ];
  showCreateFactory: boolean = false;
  formTitle: string = '';
  factoryUpdate: Factory = {} as Factory;
  tableTitle: string = 'Fabricas';

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService,
      private factoryService: FactoryService) {}

  ngOnInit(): void {
    console.log('Se cargan los factories de la db por medio de un servicio');
    this.factoryService.findAll()
      .subscribe({
        next: (res) => {
          this.factories = res;
        },
        error: (error) => {
          console.log(error);
          this.messageService.add({ severity: 'error', summary: 'ERROR!',
            detail: 'Ha ocurrido un error al intentar obtener todas las fabricas/Representadas'});
        }
      });
  }

  onActions(action: TableEvent<Factory>) {
    switch(action.type) {
      case 'edit':
        this.editFactory(action.data);
      break;
      case 'delete':
        this.deleteFactory(action.data);
      break;
      case 'create':
        this.createFactory();
      break;
    }
  }

  deleteFactory(factory: Factory) {
    this.confirmationService.confirm({
      message: `Desea eliminar la fabrica: "${factory.name}"`,
      header: 'Confirmar Eliminacion',
      icon: 'pi pi-info-delete',
      accept: () => {
        this.factoryService.delete(factory._id!)
          .subscribe({
            next: (res) => {
              this.factories = this.factories.filter(value => value._id !== res._id);
              this.messageService.add({ severity: 'info', summary: 'Informacion',
                detail: `La Fabrica: ${res.name}, se ha eliminado exitosamente.`})
            },
            error: (error) => {
              console.log(error);
              this.messageService.add({ severity: 'error', summary: 'ERROR!',
                detail: `Ha ocurrido un error al intentar eliminar la Fabrica: ${factory.name}.`});
            }
          });
      }
    })
  }

  editFactory(factory: Factory) {
    this.formTitle = 'Editar Fabrica';
    this.factoryUpdate = factory;
    this.showCreateFactory = true;
  }

  createFactory() {
    this.formTitle = 'Nueva Fabrica';
    this.factoryUpdate = {} as Factory;
    this.showCreateFactory = true;
  }

  onDialogClose(dialogData: DialogData<Factory>): void {
    this.showCreateFactory = false;
    if(dialogData.data._id) {
      this.factoryService.update(dialogData.data)
        .subscribe({
          next: (res) => {
            const index = this.factories.findIndex(val => val._id === res._id);
            (index !== -1) ? this.factories[index] = res : '';
            this.factories = [...this.factories];
            this.messageService.add({ severity: 'success', summary: 'Informacion',
              detail: `La fabrica ${res.name}, se ha modificado exitosamente.`});
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'ERROR!',
              detail: `Ha ocurrido un error al intentar modificar la Fabrica: ${dialogData.data.name}.`});
          }
        });
    } else {
      console.log(dialogData.data);
      this.factoryService.create(dialogData.data)
        .subscribe({
          next: (res) => {
            this.factories.push(res);
            this.factories = [...this.factories];
            this.messageService.add({ severity: 'success', summary: 'Informacion',
              detail: `La Fabrica: "${res.name}", se ha creado exitosamente.`})
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'ERROR!',
              detail: 'Ha ocurrido un error al intentar crear una nueva Fabrica.'});
          }
        })
    }
  }

}
