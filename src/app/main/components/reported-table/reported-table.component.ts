import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReportedCommission } from '../../interfaces/reportedCommision.interface';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-reported-table',
  standalone: true,
  imports: [TableModule, ButtonModule, TooltipModule, ToolbarModule, InputTextModule,
    CurrencyPipe, DatePipe],
  templateUrl: './reported-table.component.html',
  styleUrl: './reported-table.component.css'
})
export class ReportedTableComponent {

  @Input() records: Array<ReportedCommission> = [];
  @Input() loading: boolean = true;
  @Output('onAction') emitter = new EventEmitter();
  filters: Array<string> = ['createdAt', 'factory.name'];

}
