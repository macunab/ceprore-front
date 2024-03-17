import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PriceList } from '../../interfaces/priceList.interface';
import { ButtonConfig, Column, TableEvent } from '../../../shared/interfaces/genericTable.interface';
import { DialogData } from '../../interfaces/dialogData.interface';
import { GenericTableComponent } from '../../../shared/generic-table/generic-table.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { PriceListFormDialogComponent } from '../../components/price-list-form-dialog/price-list-form-dialog.component';
import { PriceListService } from '../../services/price-list.service';

@Component({
  selector: 'app-price-lists',
  standalone: true,
  imports: [GenericTableComponent, ConfirmDialogModule, ToastModule, DialogModule, PriceListFormDialogComponent],
  templateUrl: './price-lists.component.html',
  styleUrl: './price-lists.component.css',
  providers: [ConfirmationService, MessageService]
})
export class PriceListsComponent implements OnInit{
  
  priceLists: Array<PriceList> = []
  showForm: boolean = false;
  formTitle: string = '';
  tableTitle: string = 'Listas de precio';
  buttons: Array<ButtonConfig> = [
    { class: 'p-button-sm p-button-info p-button-rounded p-button-text mr-2', functionType: 'edit', icon: 'pi pi-pencil', tooltipText: 'Editar' },
    { class: 'p-button-sm p-button-danger p-button-rounded p-button-text mr-2', functionType: 'delete', icon: 'pi pi-trash', tooltipText: 'Eliminar' }
  ];
  filters: Array<string> = ['name'];
  headers: Array<Column<PriceList>> = [
    { field: 'name', title: 'Nombre' }
  ];
  priceListUpdate: PriceList = {} as PriceList;
  loadingTable: boolean = true;
  loadingButton: boolean = false;

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService,
      private priceListService: PriceListService) {}
  
  ngOnInit(): void {
    this.priceListService.findAll()
      .subscribe({
        next: (res) => {
          this.priceLists = res;
          this.loadingTable = false;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'ERROR!',
            detail: 'Ha ocurrido un error al intentar obtener todas las listas de precio'});
        }
      });
  }

  onActions(action: TableEvent<PriceList>): void {
    switch(action.type) {
      case 'edit':
        this.editPriceList(action.data);
      break;
      case 'delete':
        this.deletePriceList(action.data);
      break;
      case 'create':
        this.createPriceList();
      break;
    }
  }

  editPriceList(priceList: PriceList): void {
    this.formTitle = 'Editar Lista de precio';
    this.priceListUpdate = priceList;
    this.showForm = true;
  }

  deletePriceList(priceList: PriceList): void {
    this.confirmationService.confirm({
      message: `Desea Eliminar la lista de precios: "${priceList.name}"?`,
      header: 'Confirmar Eliminacion',
      icon: 'pi pi-info-delete',
      accept: () => {
        this.priceListService.delete(priceList._id!)
          .subscribe({
            next: (res) => {
              this.priceLists = this.priceLists.filter( value => value._id !== res._id);
              this.priceLists = [...this.priceLists];
              this.messageService.add({ severity: 'success', summary: 'Informacion', 
                detail: `La lista de precio: "${res.name}", se ha eliminado exitosamente. `})
            },
            error: () => {
              this.messageService.add({ severity: 'error', summary: 'ERROR!',
                detail: `Ha occurrido un error al intentar eliminar la Lista de precios: ${priceList.name}`});
            }
          })
      }
    })
  }

  createPriceList(): void {
    this.formTitle = 'Nueva Lista de precio';
    this.priceListUpdate = {} as PriceList;
    this.showForm = true;
  }

  onFormClose(dialogData: DialogData<PriceList>): void {

    this.loadingButton = true;
    if(dialogData.data._id) {
      this.priceListService.edit(dialogData.data)
        .subscribe({
          next: (res) => {
            const index = this.priceLists.findIndex( value => value._id === res._id);
            (index !== -1) ? this.priceLists[index] = res : '';
            this.priceLists = [...this.priceLists];
            this.messageService.add({ severity: 'success', summary: 'Informacion', 
              detail: `La lista de precio: "${res.name}", fue modificada exitosamente.`});
            this.showForm = false;
            this.loadingButton = false;  
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'ERROR!',
              detail: `Ha ocurrido un error al intentar modificar la Lista de precio: ${dialogData.data.name}`});
            this.loadingButton = false;
          }
        });
    } else {
      this.priceListService.create(dialogData.data)
        .subscribe({
          next: (res) => {
            this.priceLists.push(res);
            this.priceLists = [...this.priceLists];
            this.messageService.add({ severity: 'success', summary: 'Informacion',
              detail: `Se ha creado exitosamente la Lista de precio: ${res.name}`});
            this.showForm = false;
            this.loadingButton = false;
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'ERROR!',
              detail: `Ha ocurrido un error al intentar crear una nueva Lista de precio`});
            this.loadingButton = false;
          }
        });
    }
  }
}
