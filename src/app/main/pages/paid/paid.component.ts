import { Component, OnInit } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { PaidTableComponent } from '../../components/paid-table/paid-table.component';
import { PaidFormDialogComponent } from '../../components/paid-form-dialog/paid-form-dialog.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Paid } from '../../interfaces/paid.interface';
import { TableEvent } from '../../../shared/interfaces/genericTable.interface';

@Component({
  selector: 'app-paid',
  standalone: true,
  imports: [ConfirmDialogModule, ToastModule, DialogModule, PaidTableComponent, PaidFormDialogComponent],
  templateUrl: './paid.component.html',
  styleUrl: './paid.component.css',
  providers: [ConfirmationService, MessageService]
})
export class PaidComponent implements OnInit{

  paidOrders: Array<Paid> = [];
  
  constructor(private confirmation: ConfirmationService, private message: MessageService) {}
  
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  onAction(action: TableEvent<Paid>): void {

  }

  onRendered(): void {

  }

}
