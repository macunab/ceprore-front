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
import { CommonModule, PercentPipe } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, DropdownModule, DialogModule,
    ToastModule, TableModule, PercentPipe, CustomerFactoryDialogComponent, CommonModule],
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
    ivaCondition: ['', [Validators.required]],
    priceList: ['', [Validators.required]]
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
      this.customer = data as Customer;
      this.customerFactories = this.customer.discountsByFactory ? this.customer.discountsByFactory : [];
      console.table(this.customer)
    }
  }

  onSubmit() {
    if(this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }
    if(this.customerFactories.length < 1) {
      this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'Debe asignarle por lo menos una fabrica al cliente'});
      return;
    }
    if(this.customer) {
      // update
      this.customer = { id: this.customer.id, discountsByFactory: this.customerFactories, ...this.customerForm.value }
    } else {
      // create
      this.customer = { ...this.customerForm.value, discountsByFactory: this.customerFactories };
    }
    console.table(this.customer);
    this.router.navigateByUrl('main/customers');
  }

  addFactoryDiscount() {
    this.showDialog = true;
    this.factoryDiscount.cleanForm();
  }

  removeCustomerFactory(customerFactory: CustomerFactory) {
    this.customerFactories = [...this.customerFactories.filter( val => val !== customerFactory)];
  }

  onDialogClose(dialogData: DialogData<CustomerFactory>): void {
    if(this.customerFactories.find( key => key.factory.id === dialogData.data.factory.id)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La fabrica seleccionada ya fue cargada al cliente.' });
      return;
    }
    this.customerFactories.push(dialogData.data);
    this.showDialog = false;
  }

  isValid(field: string): boolean | null {
    return this.customerForm.controls[field].errors
      && this.customerForm.controls[field].touched;
  }

  cancelSubmit(): void {
    this.router.navigateByUrl('main/customers');
  }
}
