import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { InvoicedPercent, Order, ProductCart } from '../../interfaces/order.interface';
import { Factory } from '../../interfaces/factory.interface';
import { Customer, CustomerFactory } from '../../interfaces/customer.interface';
import { PriceList } from '../../interfaces/priceList.interface';
import { Delivery } from '../../interfaces/delivery.interface';
import { Product } from '../../interfaces/product.interface';
import { CurrencyPipe, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-pending-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, DropdownModule, DialogModule,
    ToastModule, TableModule, TooltipModule, CurrencyPipe, PercentPipe],
  templateUrl: './pending-form.component.html',
  styleUrl: './pending-form.component.css',
  providers: [MessageService]
})
export class PendingFormComponent implements OnInit {
  
  orderForm: FormGroup = this.fb.group({
    customer: [{ value:'', disabled: true }, [Validators.required]],
    factory: ['', [Validators.required]],
    priceList: ['', [Validators.required]],
    delivery: [''],
    invoicedPercent: ['', [Validators.required]],
    observations: [],
    cascadeDiscount: [],
    discounts: this.fb.array([])
  });
  orderUpdate: Order = {} as Order;
  selectedProducts: Array<ProductCart> = [];
  selectedProductsDisplayed: Array<ProductCart> = [];
  selectedCustomer: Customer = {} as Customer;
  products: Array<ProductCart> = []
  factories: Array<Factory> = [];
  customers: Array<Customer> = [{
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
      ], priceList: { id: '2222', name: 'Distribuidoras' }
  },
  {
    id: '2222', name: 'Pedro Alonso', address: 'Bolivar 231', email: 'pedro@gmail.com', 
    discountsByFactory: [
      { factory: { id: '1111', name: 'Fabrica1', address: 'San juan 232', email: 'factory1@gmail.com'},
      delivery: { id: '1111', name: 'Cruz Azul', address: 'San Martin 124', email: 'cruzAzul@viajes.com' },
      discounts: [5, 5], cascadeDiscount: 0.0975 }], priceList: { id: '2222', name: 'Distribuidoras' }
  }
];
  priceLists: Array<PriceList> = [
    { id: '1111', name: 'Supermercados' },
    { id: '2222', name: 'Distribuidoras' },
    { id: '3333', name: 'Cliente frecuentes' },
    { id: '4444', name: 'Campo Agroindustria' }
  ];
  deliveries: Array<Delivery> = [
    { id: '1111', name: 'Cruz Azul', address: 'San Martin 124', email: 'cruzAzul@viajes.com' },
    { id: '2222', name: 'Carlitos SA', address: 'Inigo de la pascua 123', email: 'carlitos@gmail.com' },
    { id: '3333', name: 'Fedex Arg', address: 'Carlos Gardel 233', email: 'fedexArg@fedex.com'}
  ];
  formTitle: string = 'Nuevo Pedido';
  percentOptions: Array<InvoicedPercent> = [{ percentString: '0%', percentNumber: 0}, 
  { percentString: '50%', percentNumber: 0.5}, { percentString: '100%', percentNumber: 1 }];
  showCustomers: boolean = false;
  showProducts: boolean = false;
  remitAmount: number = 0;
  invoicedAmount: number = 0;
  ivaAmount: number = 0;
  netTotal: number = 0;
  finalDiscount: number = 0;
  netTotalWithDiscount: number = 0;
  total: number = 0;

  constructor(private fb: FormBuilder, private message: MessageService) {}

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  get discounts(): FormArray {
    return <FormArray>this.orderForm.get('discounts');
  }

  addDiscount(): void {
    this.discounts.push(this.fb.group({
      discount: [0, [Validators.required]]
    }));
  }

  removeDiscount(itemIndex: number): void {
    this.discounts.removeAt(itemIndex);
  }

  onSubmit(): void {
    console.log(this.selectedCustomer);
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

  customerSelection(): void {
    this.products = [];
    if(this.selectedCustomer !== null && this.selectedCustomer.id) {
      this.orderForm.get('customer')?.setValue(this.selectedCustomer.name);
      this.orderForm.get('priceList')?.setValue(this.selectedCustomer.priceList);
      let customerFactories = this.selectedCustomer.discountsByFactory?.map(value => {
        return value.factory;
      });
      this.factories = customerFactories!;
      this.showCustomers = false;
    } else {
      this.message.add({ severity: 'warn', summary: 'Advertencia', detail: 'Asegurese de seleccionar un cliente primero.'});
    }
  }

  factorySelection(): void {
    let selectedFactory = this.orderForm.get('factory')!.value;
    let customerFactory: CustomerFactory = this.selectedCustomer
      .discountsByFactory?.find(value => value.factory.id === selectedFactory.id)!;
    this.orderForm.get('delivery')?.setValue(customerFactory.delivery);
    this.orderForm.get('cascadeDiscount')?.setValue(customerFactory.cascadeDiscount*100);
    this.loadProducts();
  }

  loadProducts(): void {
    // en este metodo voy a llamar a los productos en base a una fabrica
    if(this.orderForm.get('factory')?.value !== null) {
      // este serian los productos obtenidos del servicios en base a la fabrica seleccionada, por eso el if superior...
      let productsByFactory: Array<Product> = [
        { id: '1111', code: 'CA-1231', name: 'Gallete Cracker', description: 'Galleta cracker multicereal Ceralmix. Fabrica Otonello',
        boxesPallet: 10, unitsBox: 24, factory: { id: '1111', name: 'factory1', address: 'asdasdasd', email: 'asas@gmail.com'},
        pricesByList: [{ list: { id: '1111', name: 'Supermercados' }, price: 150 }, { list: {id: '2222', name: 'Distribuidoras'}, price: 170 }] },
        { id: '2222', code: 'CA-1231', name: 'Confites de aniz', description: 'Galleta cracker multicereal Ceralmix. Fabrica Otonello',
        boxesPallet: 10, unitsBox: 24, factory: { id: '1111', name: 'factory1', address: 'asdasdasd', email: 'asas@gmail.com'},
        pricesByList: [{ list: { id: '1111', name: 'Supermercados' }, price: 150 }, { list: {id: '2222', name: 'Distribuidoras'}, price: 250 }] },
        { id: '3333', code: 'CA-1231', name: 'Galletas surtidas', description: 'Galleta cracker multicereal Ceralmix. Fabrica Otonello',
        boxesPallet: 10, unitsBox: 24, factory: { id: '1111', name: 'factory1', address: 'asdasdasd', email: 'asas@gmail.com'},
        pricesByList: [{ list: { id: '1111', name: 'Supermercados' }, price: 150 }, { list: {id: '2222', name: 'Distribuidoras'}, price: 150 }] },
        { id: '4444', code: 'CA-1231', name: 'Chocolate aguila', description: 'Galleta cracker multicereal Ceralmix. Fabrica Otonello',
        boxesPallet: 10, unitsBox: 24, factory: { id: '1111', name: 'factory1', address: 'asdasdasd', email: 'asas@gmail.com'},
        pricesByList: [{ list: { id: '1111', name: 'Supermercados' }, price: 150 }, { list: {id: '2222', name: 'Distribuidoras'}, price: 540 }] }
      ];
      this.products = productsByFactory.map(value => {
        let price  = value.pricesByList.find(value => value.list.id === this.orderForm.get('priceList')?.value.id);
        return { product: value, price: price?.price!, quantity: 1, bonus: 0, subtotal: price?.price!};
      });
      console.log(this.products);
    }
  }

  calculatedSubtotal(product: ProductCart): number {
    product.subtotal = product.quantity * product.price; 
    return product.subtotal;
  }

  selectProductsEvent(): void {
    if(this.orderForm.get('invoicedPercent')?.value !== '') {
      this.showProducts = false;
      this.netTotal = this.selectedProducts.reduce(
        (acc, cu) => acc + cu.subtotal, 0,
      )
      this.finalDiscount = this.calculateFinalDiscount() !== 0 ?
      (1 - (1 - this.calculateFinalDiscount()) * (1 - this.orderForm.get('cascadeDiscount')?.value/100)) 
      : this.orderForm.get('cascadeDiscount')?.value/100;
      // console.log('TOTAL: ',this.netTotal);
      // console.log('FACTURADOL ', this.invoicedAmount);
      // console.log('REMITO: ',this.remitAmount);
      // console.log('MONTO IVA: ', this.ivaAmount);
      this.netTotalWithDiscount = this.netTotal - (this.netTotal*this.finalDiscount);
      this.invoicedAmount = this.netTotal*this.orderForm.get('invoicedPercent')?.value.percentNumber;
      this.remitAmount = this.netTotal - this.invoicedAmount;
      this.ivaAmount = this.invoicedAmount + (this.invoicedAmount*0.21);
      console.log('DISCOUNT CASCADE: ', this.calculateFinalDiscount());
      console.log('DISCOUNT : ', this.finalDiscount);
      
      this.selectedProductsDisplayed = this.selectedProducts;
    } else {
      this.message.add({ severity: 'warn', summary: 'Aviso!', detail: 'Seleccione el porcentaje facturado antes que los productos'});
    }
    
  }

  deleteProductFromSelection(product: ProductCart): void {
    this.selectedProducts = this.selectedProducts.filter(value => value.product.id !== product.product.id);
    this.selectedProductsDisplayed = this.selectedProducts;
    this.selectProductsEvent();
  }

  calculateFinalDiscount(): number {
    let discountsArray: Array<number> = this.discounts.value.map( function(val: any) {
      return val.discount;
    })
    if(discountsArray.length) {
      const realDiscount = discountsArray.reduce((acc, cu) => {
        let count = (acc >= 1) ? (1-(acc/100))*(1-(cu/100)) : ((acc) * (1-(cu/100)));
        return count;
      });
      return ((realDiscount >= 1 || realDiscount == 0) ? realDiscount/100 : (1-realDiscount));
    } else {
      return 0;
    }
  }

}
