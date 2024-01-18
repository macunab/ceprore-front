import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PriceList, Temp } from '../../interfaces/priceList.interface';
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
  
  priceLists: Array<PriceList> = [
    { _id: '1111', name: 'Supermercados' },
    { _id: '2222', name: 'Distribuidoras' },
    { _id: '3333', name: 'Cliente frecuentes' },
    { _id: '4444', name: 'Campo Agroindustria' }
  ]
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

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService,
      private priceListService: PriceListService) {}
  
  ngOnInit(): void {
    // get priceLists from service...
    this.priceListService.findAll()
      .subscribe( resp => {
        this.priceLists = resp;
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
    // console.log(priceList);
    this.confirmationService.confirm({
      message: `Desea Eliminar la lista de precios: "${priceList.name}"?`,
      header: 'Confirmar Eliminacion',
      icon: 'pi pi-info-delete',
      accept: () => {
        try {
          this.priceListService.delete(priceList._id!)
            .subscribe(resp => {
              if(typeof resp !== 'boolean') {
                this.priceLists = this.priceLists.filter( value => value._id !== resp._id);
                this.priceLists = [...this.priceLists];
                this.messageService.add({ severity: 'info', summary: 'Informacion', 
                detail: `La lista de precio: "${resp.name}", se ha eliminado exitosamente. `})
              } else {
                this.messageService.add({ severity: 'error', summary: 'ERROR!', 
                  detail: `Ha ocurrido un error de parte del servidor al intentar eliminar la lista de precio: "${priceList.name}".`});
              }
            })
        } catch(error) {
          this.messageService.add({ severity: 'error', summary: 'ERROR!', 
            detail: `Ha ocurrido un error al intentar eliminar la lista de precio: "${priceList.name}".`});
        }
      }
    })
  }

  createPriceList(): void {
    this.formTitle = 'Nueva Lista de precio';
    this.priceListUpdate = {} as PriceList;
    this.showForm = true;
  }

  onFormClose(dialogData: DialogData<PriceList>): void {
    this.showForm = false;
    console.log(dialogData.data._id)
    if(dialogData.data._id) {
      try {
        // update service
        this.priceListService.edit(dialogData.data)
          .subscribe(resp => {
            const index = this.priceLists.findIndex( value => value._id === resp._id);
            (index !== -1) ? this.priceLists[index] = resp : '';
            this.priceLists = [...this.priceLists];
            this.messageService.add({ severity: 'info', summary: 'Informacion', 
              detail: `La lista de precio: "${resp.name}", fue modificada exitosamente.`});
          })
      } catch(error) {
        this.messageService.add({ severity: 'error', summary: 'ERROR!', 
          detail: `Ocurrio un error al intentar modificar la list de precio: "${dialogData.data.name}".`})
      }
    } else {
      try {
        this.priceListService.create(dialogData.data)
          .subscribe(resp => {
            this.priceLists.push(resp);
          this.priceLists = [...this.priceLists];
          this.messageService.add({ severity: 'info', summary: 'Informacion',
            detail: `Se ha creado exitosamente la lista de precio: ${resp.name}`})
          })
      } catch(error) {
        this.messageService.add({ severity: 'error', summary: 'ERROR!', 
          detail: 'Ocurrio un error al intentar crear un nuevo transporte.'})
      }
    }
  }

}
