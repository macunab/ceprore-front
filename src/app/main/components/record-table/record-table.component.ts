import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Order } from '../../interfaces/order.interface';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-record-table',
  standalone: true,
  imports: [TableModule, ButtonModule, TooltipModule, ToolbarModule, InputTextModule,
    CurrencyPipe, DatePipe],
  templateUrl: './record-table.component.html',
  styleUrl: './record-table.component.css'
})
export class RecordTableComponent {

  @Input() records: Array<Order> = [];
  @Input() loading: boolean = true;
  @Output('onAction') emitter = new EventEmitter();
  filters: Array<string> = ['customer.name', 'factory.name', 'payment.createdAt', 'invoice.invoiceCode'];

}
