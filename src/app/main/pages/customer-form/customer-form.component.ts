import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { Customer, CustomerFactory } from '../../interfaces/customer.interface';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { PriceList } from '../../interfaces/priceList.interface';
import { DialogData } from '../../interfaces/dialogData.interface';
import { CustomerFactoryDialogComponent } from '../../components/customer-factory-dialog/customer-factory-dialog.component';
import { PercentPipe } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, DropdownModule, DialogModule,
    ToastModule, TableModule, PercentPipe, CustomerFactoryDialogComponent ],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.css',
  providers: [MessageService]
})
export class CustomerFormComponent {
  
  title: string = 'Nuevo Cliente';
  customerFactories: Array<CustomerFactory> = [];
  customerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    address: ['', [Validators.required]],
    email: [''],
    ivaCondition: [''],
    priceList: ['']
  });
  ivaCondition: Array<string> = ['Responsable inscripto', 'Afiliado al gremio!'];
  priceList: Array<PriceList> = [
    { id: '1111', name: 'Monotributo' },
    { id: '2222', name: 'Supermercados' }
  ];
  showDialog: boolean = false;
  @ViewChild(CustomerFactoryDialogComponent) factoryDiscount!: CustomerFactoryDialogComponent;
  customer!: Customer;

  constructor(private fb: FormBuilder, private router: Router, 
      private messageService: MessageService) {
    const data = this.router.getCurrentNavigation()?.extras.state;
    if(data) {
      this.title = 'Editar Cliente';
      this.customerForm.patchValue(data);
    }
  }

  onSubmit() {
    console.log('PASO A SUBMIT');
    if(this.customerForm.invalid) {
      return;
    }
    this.customer = { ...this.customerForm.value, discountsByFactory: this.customerFactories };
    console.table(this.customer);
  }

  addFactoryDiscount() {
    this.showDialog = true;
    this.factoryDiscount.cleanForm();
  }

  removeCustomerFactory(customerFactory: CustomerFactory) {
    this.customerFactories = [...this.customerFactories.filter( val => val !== customerFactory)];
  }

  onDialogClose(dialogData: DialogData<CustomerFactory>): void {
    if(this.customerFactories.find( key => key.factory === dialogData.data.factory)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La fabrica ya fue cargada al cliente' });
      return;
    }
    this.customerFactories.push(dialogData.data);
    this.showDialog = false;
  }

}
