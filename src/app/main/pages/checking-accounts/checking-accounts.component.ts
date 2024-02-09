import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { Factory } from '../../interfaces/factory.interface';
import { FactoryService } from '../../services/factory.service';
import { Order } from '../../interfaces/order.interface';
import { OrderService } from '../../services/order.service';
import { MessageService } from 'primeng/api';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-checking-accounts',
  standalone: true,
  imports: [FieldsetModule, DropdownModule, ButtonModule,
    FormsModule, CardModule, TableModule, ToastModule, DatePipe, CurrencyPipe],
  templateUrl: './checking-accounts.component.html',
  styleUrl: './checking-accounts.component.css',
  providers: [MessageService]
})
export class CheckingAccountsComponent implements OnInit{

  factories: Array<Factory> = [];
  surrenderOrders: Array<Order> = [];
  selectedFactory: Factory | undefined;

  constructor(private factoryService: FactoryService, private orderService: OrderService, 
      private messageService: MessageService) {}

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
      this.orderService.findAllSurrendersByFactory(this.selectedFactory._id!)
        .subscribe({
          next: res => {
            this.surrenderOrders = res;
          },
          error: err => {
            console.log(err);
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
}
