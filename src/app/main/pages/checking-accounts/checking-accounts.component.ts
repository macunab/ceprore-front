import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Factory } from '../../interfaces/factory.interface';
import { FactoryService } from '../../services/factory.service';
import { Order } from '../../interfaces/order.interface';
import { OrderService } from '../../services/order.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-checking-accounts',
  standalone: true,
  imports: [FieldsetModule, DropdownModule, ButtonModule, ConfirmDialogModule,
    FormsModule, CardModule, TableModule, ToastModule, DatePipe, CurrencyPipe, TooltipModule],
  templateUrl: './checking-accounts.component.html',
  styleUrl: './checking-accounts.component.css',
  providers: [ConfirmationService, MessageService]
})
export class CheckingAccountsComponent implements OnInit{

  factories: Array<Factory> = [];
  surrenderOrders: Array<Order> = [];
  selectedFactory: Factory | undefined;
  loadingSearchButton: boolean = false;
  noResultSearch: string = '...';

  constructor(private factoryService: FactoryService, private orderService: OrderService, 
      private messageService: MessageService, private confirmationService: ConfirmationService,) {}

  ngOnInit(): void {
    this.factoryService.findAll()
      .subscribe({
        next: res => {
          this.factories = res;
        },
        error: err => {
          console.log(err);
        }
      });
  }

  onSurrendersSearch(): void {

    if(this.selectedFactory !== undefined) {
      this.loadingSearchButton = true;
      this.orderService.findAllOrderByFactoryAndStatus(this.selectedFactory._id!, 'SURRENDER')
        .subscribe({
          next: res => {
            this.surrenderOrders = res;
            this.loadingSearchButton = false;
            if(res.length < 1) {
              this.noResultSearch = `No se han encontrado ordenes para rendir de la Representada: ${this.selectedFactory?.name}`;
            }
          },
          error: () => {
            this.loadingSearchButton = false;
            this.surrenderOrders = [];
            this.messageService.add({ severity: 'error', summary: 'ERROR!',
              detail: 'Ha ocurrido un error al intentar obtener los pedidos de la Representada seleccionada.'})
          }
        });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Aviso',
        detail: 'Para realizar una busqueda primero seleccione una Representada.'})
    }
  }

  printSurrender(surrender: Order): void {

    this.orderService.printSurrender(surrender)
      .subscribe({
        next: res => {
          let blob = new Blob([res], { type: 'application/pdf' });
          let pdfUrl = window.URL.createObjectURL(blob);
          window.open(pdfUrl, '_blank');
        },
        error: err => {
          console.log(err);
          this.messageService.add({ severity: 'error', summary: 'ERROR!',
            detail: 'Ha ocurrido un error al intentar generar el archivo pdf.'});
        }
      })
  }

  recordSurrender(surrender: Order): void {
    console.log('record the selected surrender...');
    this.confirmationService.confirm({
      message: 'Esta seguro que desea marcar el pedido como finalizado?',
      header: 'Confirmar Finalizacion',
      icon: 'pi pi-info-delete',
      accept: () => {
        surrender.status = 'SETTLEMENT';
        this.orderService.update(surrender)
          .subscribe({
            next: res => {
              this.surrenderOrders = this.surrenderOrders.filter(val => val._id !== res._id);
              this.surrenderOrders = [...this.surrenderOrders];
              this.messageService.add({ severity: 'success', summary: 'Informacion',
                detail: 'El Pedido seleccionado ha sido finalizado exitosamente.'})
            },
            error: () => {
              this.messageService.add({ severity: 'error', summary: 'ERROR!',
                detail: 'Ha ocurrido un erro al intentar finalizar el Pedido seleccionado.'});
            }
          });
      }
    });
  }
}
