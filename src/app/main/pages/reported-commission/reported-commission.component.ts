import { Component, OnInit } from '@angular/core';
import { ReportedCommission } from '../../interfaces/reportedCommision.interface';
import { ReportedCommissionService } from '../../services/reportedCommission.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ReportedTableComponent } from '../../components/reported-table/reported-table.component';
import { TableEvent } from '../../../shared/interfaces/genericTable.interface';

@Component({
  selector: 'app-reported-commission',
  standalone: true,
  imports: [ReportedTableComponent, ToastModule],
  templateUrl: './reported-commission.component.html',
  styleUrl: './reported-commission.component.css',
  providers: [MessageService]
})
export class ReportedCommissionComponent implements OnInit{
  
  reportedCommissions: Array<ReportedCommission> = [];
  loadingTable: boolean = true;

  constructor(private reportService: ReportedCommissionService,
      private message: MessageService) {}
  
  ngOnInit(): void {
    this.reportService.findAllReportedCommisions()
      .subscribe({
        next: res => {
          this.reportedCommissions = res;
          this.loadingTable = false;
        },
        error: () => {
          this.message.add({ severity: 'error', summary: 'ERROR',
            detail: 'Se ha producido un error al intentar obtener todos los reportes.'});
        }
      });
  }

  onAction(action: TableEvent<ReportedCommission>): void {

    switch(action.type) {
      case 'print':
        this.printReport(action.data);
      break;
    }
  }

  printReport(report: ReportedCommission): void {

    this.loadingTable = true;
    this.reportService.printReport(report)
      .subscribe({
        next: res => {
          let blob = new Blob([res], { type: 'application/pdf' });
          let pdfUrl = window.URL.createObjectURL(blob);
          window.open(pdfUrl, '_blank');
          this.loadingTable = false;
        },
        error: () => {
          this.message.add({ severity: 'error', summary: 'ERROR',
            detail: 'Ha ocurrido un error al intentar generar un Documento del reporte de comision seleccionado.'});
          this.loadingTable = false;
        }
      })
  }
}
