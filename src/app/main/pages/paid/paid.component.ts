import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { PaidTableComponent } from '../../components/paid-table/paid-table.component';
import { PaidFormDialogComponent } from '../../components/paid-form-dialog/paid-form-dialog.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Paid } from '../../interfaces/paid.interface';
import { TableEvent } from '../../../shared/interfaces/genericTable.interface';
import { DialogData } from '../../interfaces/dialogData.interface';

@Component({
  selector: 'app-paid',
  standalone: true,
  imports: [ConfirmDialogModule, ToastModule, DialogModule, PaidTableComponent, PaidFormDialogComponent],
  templateUrl: './paid.component.html',
  styleUrl: './paid.component.css',
  providers: [ConfirmationService, MessageService]
})
export class PaidComponent implements OnInit{

  paidOrders: Array<Paid> = [
    {
      id: '1111', justifiedDebitNote: 0, justifiedDebitNoteObservations: '', withholdings: 100, withholdingsObservations: 'Retencion por algo',
      paymentOnAccount: 0, total: 2900, commission: 145, isAccountable: false, createAt: new Date(2023,5, 23), renderedDate: new Date(2023,7, 12),
      invoice: {
        id: '1111', invoiceCode: 'RT-0001231', createAt: new Date(2023,8,22), invoiceDate: new Date(2023,8,15),
      paymentDeadline: 10, deliveryTerm: 15, ivaAmount: 300, invoicedAmount: 1300, remitAmount: 1300, total: 2900,
      order: {
        id: '1111', createAt: new Date(2020,8,15), code: 'ASD-324', status: 'Pendiente', total: 3369.6975,
      customer: {
        id: '1111', name: 'Carlo Juarez', address: 'San juan 1234', email: 'carlos@gmail.com', 
          discountsByFactory: [
            { factory: { id: '1111', name: 'Fabrica1', address: 'San juan 232', email: 'factory1@gmail.com'},
            delivery: { id: '1111', name: 'Cruz Azul', address: 'San Martin 124', email: 'cruzAzul@viajes.com' },
            discounts: [5, 5], cascadeDiscount: 0.0975 },
            { factory: { id: '1212', name: 'Carilo SA', address: 'Suipacha 123', email: 'carilo@gmail.com' },
            delivery: { id: '3333', name: 'Fedex Arg', address: 'Carlos Gardel 233', email: 'fedexArg@fedex.com'},
            discounts: [5], cascadeDiscount: 0.05 },
            { factory: { id: '2222', name: 'Sancor Productos', address: 'Ituzaingo 232', email: 'sancor@gmail.com' },
            delivery: { id: '2222', name: 'Carlitos SA', address: 'Inigo de la pascua 123', email: 'carlitos@gmail.com' },
            discounts: [5], cascadeDiscount: 0.05 }
          ], priceList: { _id: '2222', name: 'Distribuidoras' }
      },
      priceList: { _id: '2222', name: 'Distribuidoras' }, 
      delivery: { id: '2222', name: 'Carlitos SA', address: 'Inigo de la pascua 123', email: 'carlitos@gmail.com' },
      factory: { id: '2222', name: 'Sancor Productos', address: 'Ituzaingo 232', email: 'sancor@gmail.com', commission: 0.05 },
      observations: 'Se vendera la mitad por remito pero se retirara en fecha acordada. Sin envio la parte de remito.',
      cascadeDiscount: 5, invoicedPercent: { percentString: '50%', percentNumber: 0.5},
      productsCart: [
        { product: { id: '1111', code: 'CA-1231', name: 'Gallete Cracker', description: 'Galleta cracker multicereal Ceralmix. Fabrica Otonello',
        boxesPallet: 10, unitsBox: 24, factory: { id: '1111', name: 'factory1', address: 'asdasdasd', email: 'asas@gmail.com'},
        pricesByList: [{ list: { _id: '1111', name: 'Supermercados' }, price: 150 }, { list: {_id: '2222', name: 'Distribuidoras'}, price: 170 }] }, price: 170,
      quantity: 1, bonus: 0,subtotal: 170 },
      { product: { id: '2222', code: 'CA-1231', name: 'Confites de aniz', description: 'Galleta cracker multicereal Ceralmix. Fabrica Otonello',
      boxesPallet: 10, unitsBox: 24, factory: { id: '1111', name: 'factory1', address: 'asdasdasd', email: 'asas@gmail.com'},
      pricesByList: [{ list: { _id: '1111', name: 'Supermercados' }, price: 150 }, { list: {_id: '2222', name: 'Distribuidoras'}, price: 250 }] },
      price: 250, quantity: 10, bonus: 0, subtotal: 2500 },
      { product: { id: '4444', code: 'CA-1231', name: 'Chocolate aguila', description: 'Galleta cracker multicereal Ceralmix. Fabrica Otonello',
      boxesPallet: 10, unitsBox: 24, factory: { id: '1111', name: 'factory1', address: 'asdasdasd', email: 'asas@gmail.com'},
      pricesByList: [{ list: { _id: '1111', name: 'Supermercados' }, price: 150 }, { list: {_id: '2222', name: 'Distribuidoras'}, price: 540 }] },
      price: 540, quantity: 1, bonus: 0, subtotal: 540 }
      ], netTotal: 3210, netTotalWithDiscount: 3049.5, invoicedAmount: 1524.75, remitAmount: 1524.75, ivaAmount: 320.1975,
      discounts: [5, 5]
      }, isPaid: true
      }
    }
  ];
  showForm: boolean = false;
  paidUpdate: Paid = {} as Paid;
  @ViewChild(PaidFormDialogComponent) formDialog!: PaidFormDialogComponent;
  
  constructor(private confirmation: ConfirmationService, private message: MessageService) {}
  
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  onAction(action: TableEvent<Paid>): void {
    switch(action.type) {
      case 'print':
        console.log('IMPRIMIR PAGO');
      break;
      case 'edit':
        console.log('EDIT PAGO');
        this.paidUpdate = action.data;
        console.table(this.paidUpdate);
        this.formDialog.updateFormValues();
        this.showForm = true;
      break;
      case 'surrender':
        console.log('RENDIR PAGO');
        this.onSurrender(action.data);
      break;
      case 'delete':
        console.log('DELETE PAGO');
        this.onDelete(action.data);
      break;
    }
  }

  onDelete(paid: Paid): void {
    this.confirmation.confirm({
      header: 'Confirmar Eliminacion',
      message: 'Desea eliminar el pago seleccionado?',
      accept: () => {
        try {
          // delete paid service.
          this.paidOrders = this.paidOrders.filter(value => value.id !== paid.id);
          this.paidOrders = [...this.paidOrders];
        } catch(error) {
          this.message.add({severity: 'error', summary: 'ERROR!', 
            detail: 'Ha ocurrido un error al intentar eliminar el pago seleccionado.'});
        }
      }
    });
  }

  onSurrender(paid: Paid): void {
    this.confirmation.confirm({
      header: 'Confirmar Rendicion',
      message: 'Desea habilitar el Pago para rendicion?',
      accept: () => {
        try {
          paid.isAccountable = true;
          // update paid sarvice
          this.paidOrders = this.paidOrders.filter(value => value.id !== paid.id);
          this.message.add({ severity: 'info', summary: 'Informacion', 
            detail: 'El pago seleccionado ha sido marcado para rendicion exitosamente.'})

        } catch(error) {
          this.message.add({ severity: 'error', summary: 'ERROR!', 
            detail: 'Ha ocurrido un error al intentar rendir un pago.'});
        }
      }
    });
  }

  onPaidFormSubmit(dialogData: DialogData<Paid>): void {
    console.log(dialogData.data);
    this.showForm = false;
    if(dialogData.data.id) {
      // update paid service;
      const index = this.paidOrders.findIndex(value => value.id === dialogData.data.id);
      (index !== -1) ? this.paidOrders[index] = dialogData.data : '';
      this.paidOrders = [...this.paidOrders];
      console.log(this.paidOrders);
      this.message.add({ severity: 'info', summary: 'Informacion', 
        detail: 'El pago se ha actualizado exitosamente.'});
    }
  }
}
