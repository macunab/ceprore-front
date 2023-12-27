import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { Invoice } from '../../interfaces/invoice.interface';

@Component({
  selector: 'app-invoice-table',
  standalone: true,
  imports: [TableModule, ButtonModule, TooltipModule, ToolbarModule, InputTextModule,
    CurrencyPipe, DatePipe],
  templateUrl: './invoice-table.component.html',
  styleUrl: './invoice-table.component.css'
})
export class InvoiceTableComponent {

  @Input() invoicedOrders: Array<Invoice> = [];
  @Output('onAction') emitter = new EventEmitter();
  filters: Array<string> = [];
}
