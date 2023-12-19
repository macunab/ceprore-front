import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { InvoicedPercent, Order, ProductCart } from '../../interfaces/order.interface';
import { Factory } from '../../interfaces/factory.interface';
import { Customer } from '../../interfaces/customer.interface';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { PriceList } from '../../interfaces/priceList.interface';
import { Delivery } from '../../interfaces/delivery.interface';

@Component({
  selector: 'app-pending-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, DropdownModule, DialogModule,
    ToastModule, TableModule ],
  templateUrl: './pending-form.component.html',
  styleUrl: './pending-form.component.css',
  providers: [MessageService]
})
export class PendingFormComponent implements OnInit {
  
  orderForm: FormGroup = this.fb.group({
    customer: [{ value:'', disabled: true }, [Validators.required]],
    factory: ['', [Validators.required]],
    priceList: [''],
    delivery: [''],
    invoicedPercent: [''],
    observations: [],
  });
  orderUpdate: Order = {} as Order;
  selectedProducts: Array<ProductCart> = [];
  products: Array<ProductCart> = []
  factories: Array<Factory> = [];
  customers: Array<Customer> = [{
    id: '1111', name: 'Carlo Juarez', address: 'San juan 1234', email: 'carlos@gmail.com', 
      discountsByFactory: [
        { factory: { id: '1111', name: 'Fabrica1', address: 'San juan 232', email: 'factory1@gmail.com'},
        delivery: { id: '232323', name: 'Transporte1', address: 'Felipe boero 23', email: 'transporte1@gmail.com'},
        discounts: [5, 5], cascadeDiscount: 0.0975}
      ]
  }];
  priceLists: Array<PriceList> = [];
  deliveries: Array<Delivery> = [];
  formTitle: string = 'Nuevo Pedido';
  percentOptions: Array<InvoicedPercent> = [{ percentString: '0%', percentNumber: 0}, 
  { percentString: '50%', percentNumber: 0.5}, { percentString: '100%', percentNumber: 1 }];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  onSubmit(): void {
    if(this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }
    console.table(this.orderForm.value);
  }

  isValid(field: string): boolean | null {
    return this.orderForm.controls[field].errors
      && this.orderForm.controls[field].touched;
  }
}
