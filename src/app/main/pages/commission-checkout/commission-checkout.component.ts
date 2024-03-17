import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Factory } from '../../interfaces/factory.interface';
import { Order } from '../../interfaces/order.interface';
import { FactoryService } from '../../services/factory.service';
import { OrderService } from '../../services/order.service';
import { ReportedCommissionService } from '../../services/reportedCommission.service';
import { ReportedCommission } from '../../interfaces/reportedCommision.interface';

@Component({
  selector: 'app-commission-checkout',
  standalone: true,
  imports: [FieldsetModule, DropdownModule, ButtonModule, ConfirmDialogModule,
    FormsModule, CardModule, TableModule, ToastModule, DatePipe, CurrencyPipe, TooltipModule,
    CalendarModule],
  templateUrl: './commission-checkout.component.html',
  styleUrl: './commission-checkout.component.css',
  providers: [ConfirmationService, MessageService]
})
export class CommissionCheckoutComponent implements OnInit{

  factories: Array<Factory> = [];
  selectedFactory: Factory | undefined;
  surrenderOrders: Array<Order> = [];
  selectedOrders: Array<Order> = [];
  rangeDates: Date[] | undefined;
  loadingButton: boolean = false;
  totalCommission: number = 0;
  reportedCommission: ReportedCommission = {} as ReportedCommission;
  noSearchResult: string = '...';

  constructor(private message: MessageService, private confirm: ConfirmationService,
    private factoryService: FactoryService, private orderService: OrderService,
    private reportedCommissionService: ReportedCommissionService) {}

  ngOnInit(): void {
    
    this.factoryService.findAll()
      .subscribe({
        next: res => {
          this.factories = res;
        },
        error: () => {
          this.message.add({ severity: 'error', summary: 'ERROR',
            detail: 'Ha ocurrido un error al intentar obtener todas las representadas.'})
        }
      })
  }

  searchSurrenderOrders(): void {

    if(this.rangeDates !== null)
      if(this.rangeDates !== undefined && this.rangeDates[1] === null) {
        this.message.add({ severity: 'warn', summary: 'Aviso',
          detail: 'Seleccione un rango de fechas para poder realizar una busqueda.'});
        return;
      }

    if(this.selectedFactory === undefined) {
      this.message.add({ severity: 'warn', summary: 'Aviso',
        detail: 'Seleccione una Representada para poder realizar una busqueda.'});
      return;
    }

    if(this.rangeDates === undefined || this.rangeDates === null) {
      this.loadingButton = true;
      this.orderService.findAllSurrendersByFactory(this.selectedFactory._id!)
        .subscribe({
          next: res => {
            this.surrenderOrders = res;
            this.loadingButton = false;
            if(res.length < 1) {
              this.noSearchResult = `No se encontraron Pedidos para: "${this.selectedFactory?.name}"`
            }
          },
          error: () => {
            this.message.add({ severity: 'error', summary: 'ERROR',
              detail: 'Ha ocurrido un error al intentar realizar una consulta sobre los Pedidos.'});
            this.loadingButton = false;
          }
        })

    } else {

      this.loadingButton = true;
      this.orderService.findSurrendersBetweenDates(this.rangeDates[0], this.rangeDates[1], this.selectedFactory._id!)
        .subscribe({
          next: res => {
            this.surrenderOrders = res;
            this.loadingButton = false;
            if(res.length < 1) {
              this.noSearchResult = `No se encontraron Pedidos para: "${this.selectedFactory?.name}"`
            }
          },
          error: () => {
            this.message.add({ severity: 'error', summary: 'ERROR!',
              detail: 'Ha ocurrido un error al intentar buscar los Pedidos en base a un rango de fechas.'});
          }
        });
    }
  }

  onSelectOrder(): void {
    this.totalCommission = 0;
    this.selectedOrders.forEach(val => {
      this.totalCommission += val.payment?.commission!;
    });

  }

  onSubmitSelection(): void {
    this.confirm.confirm({
      message: 'Desea marcar los pedidos seleccionados como finalizados y crear una nueva planilla de reporte de comisiones?',
      header: 'Confirmar',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.reportedCommission = {} as ReportedCommission;
        if(this.rangeDates !== undefined && this.rangeDates !== null) {
          this.reportedCommission.from = this.rangeDates![0];
          this.reportedCommission.until = this.rangeDates![1];
        }

        this.reportedCommission.factory = this.selectedFactory!;
        this.reportedCommission.totalCommission = this.totalCommission;
        this.reportedCommission.orders = this.selectedOrders;

        this.reportedCommissionService.createNewReportedCommision(this.reportedCommission)
          .subscribe({
            next: res => {
              let blob = new Blob([res], { type: 'application/pdf' });
              let pdfUrl = window.URL.createObjectURL(blob);
              window.open(pdfUrl, '_blank');
              this.cleanInputs();
              this.message.add({ severity: 'success', summary: 'Aviso',
                detail: 'Se ha creado un nuevo Reporte de comision exitosamente.'});
            },
            error: () => {
              this.message.add({ severity: 'error', summary: 'ERROR',
                detail: 'Ha ocurrido un error al intentar crear un nuevo Reporte de comision.'});
            }
          });
      }
    });
  }

  cleanInputs(): void {
    this.selectedFactory = undefined;
    this.selectedOrders = [];
    this.totalCommission = 0;
    this.surrenderOrders = [];
    this.rangeDates = undefined;
  }
}
