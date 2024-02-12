import { Component, OnInit } from '@angular/core';
import { RecordTableComponent } from '../../components/record-table/record-table.component';
import { Order } from '../../interfaces/order.interface';
import { TableEvent } from '../../../shared/interfaces/genericTable.interface';
import { OrderService } from '../../services/order.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-historic',
  standalone: true,
  imports: [RecordTableComponent, ToastModule],
  templateUrl: './historic.component.html',
  styleUrl: './historic.component.css',
  providers: [MessageService]
})
export class HistoricComponent implements OnInit{
  
  records: Array<Order> = [];
  
  constructor(private orderService: OrderService,
     private message: MessageService) {}

  ngOnInit(): void {

    this.orderService.findAll('SURRENDER')
      .subscribe({
        next: res => {
          this.records = res;
        },
        error: () => {
          this.message.add({ severity: 'error', summary: 'ERROR!',
            detail: 'Ha ocurrido un error al intentar obtener todos los Pedidos historicos.'});
        }
      });
  }

  onAction(action: TableEvent<Order>): void {
    
    switch(action.type) {
      case 'print':
        console.log('PRINT');
      break;
    }
  }
}
