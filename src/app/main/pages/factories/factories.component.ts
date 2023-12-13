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
    { id: '1111', name: 'Carilo SA', address: 'Suipacha 123', email: 'carilo@gmail.com' },
    { id: '2222', name: 'Sancor Productos', address: 'Ituzaingo 232', email: 'sancor@gmail.com' },
    { id: '3333', name: 'Holidays SA', address: 'Olaen 232', email: 'holidays@gmail.com' },
    { id: '4444', name: 'Arcor', address: 'Ruta 2 232', email: 'arcor@gmail.com' }
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

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    console.log('Se cargan los factories de la db por medio de un servicio');
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
        // try/catch delete factory service. if ok...
        try {

        } catch(error) {
          this.messageService.add({ severity: 'error', summary: 'Error', 
            detail: `Ha ocurrido un error al intentar eliminar la fabrica: "${factory.name}"`});
        }
        this.factories = this.factories.filter(value => value.id !== factory.id);
        this.messageService.add({ severity: 'info', summary: 'Informacion',
          detail: `La fabrica: "${factory.name}", se ha eliminado exitosamente`});
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
    console.table(dialogData.data);
    if(dialogData.data.id) {
      // update service - try/catch
    } else {
      // create service - try/catch
    }
  }

}
