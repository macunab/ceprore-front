import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { Order } from '../../interfaces/order.interface';

@Component({
  selector: 'app-paid-table',
  standalone: true,
  imports: [TableModule, ButtonModule, TooltipModule, ToolbarModule, InputTextModule,
    CurrencyPipe, DatePipe],
  templateUrl: './paid-table.component.html',
  styleUrl: './paid-table.component.css'
})
export class PaidTableComponent {

  @Input() paidOrders: Array<Order> = [];
  @Input() loading: boolean = true;
  @Output('onAction') emitter = new EventEmitter();
  filters: Array<string> = [];

}
