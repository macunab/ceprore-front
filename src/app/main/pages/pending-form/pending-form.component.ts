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
import { InputTextareaModule } from 'primeng/inputtextarea';

import { Cart, InvoicedPercent, Order } from '../../interfaces/order.interface';
import { Factory } from '../../interfaces/factory.interface';
import { Customer, CustomerFactory } from '../../interfaces/customer.interface';
import { PriceList } from '../../interfaces/priceList.interface';
import { Delivery } from '../../interfaces/delivery.interface';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Router } from '@angular/router';
import { PriceListService } from '../../services/price-list.service';
import { DeliveryService } from '../../services/delivery.service';
import { OrderService } from '../../services/order.service';
import { CustomerService } from '../../services/customer.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-pending-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, DropdownModule, DialogModule,
    ToastModule, TableModule, TooltipModule, InputTextareaModule, CurrencyPipe, PercentPipe],
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
    observations: [''],
    customerDiscount: ['',[Validators.required]],
    discounts: this.fb.array([])
  });
  orderUpdate: Order = {} as Order;
  selectedProducts: Array<Cart> = [];
  selectedProductsDisplayed: Array<Cart> = [];
  selectedCustomer: Customer = {} as Customer;
  products: Array<Cart> = []
  factories: Array<Factory> = [];
  customers: Array<Customer> = [];
  priceLists: Array<PriceList> = [];
  deliveries: Array<Delivery> = [];
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
  filters: Array<string> = ['name'];
  loadingSubmit: boolean = false;

  constructor(private fb: FormBuilder, private message: MessageService, 
      private router: Router, private priceListService: PriceListService, private deliveryService: DeliveryService,
      private orderService: OrderService, private customerService: CustomerService,
      private productService: ProductService) {
        const data = this.router.getCurrentNavigation()?.extras.state;
        if(data) {
          this.formTitle = 'Editar Pedido';
          this.orderUpdate = data as Order;
          delete this.orderUpdate.invoicedPercent?._id;
          this.orderUpdate.discounts?.forEach(val => this.addDiscount(val));
          this.selectedCustomer = this.orderUpdate.customer!;
          this.orderForm.patchValue(this.orderUpdate);
          this.setCustomersValues();
          this.orderForm.get('priceList')?.setValue(this.orderUpdate.priceList);
          this.orderForm.get('factory')?.setValue(this.orderUpdate.factory);
          this.loadProducts(this.orderUpdate.productsCart!);
          this.selectedProducts = this.orderUpdate.productsCart!;
          this.selectedProductsDisplayed = this.orderUpdate.productsCart!;
          this.netTotal = this.orderUpdate.netTotal!;
          this.finalDiscount = this.orderUpdate.cascadeDiscount!;
          this.netTotalWithDiscount =  this.orderUpdate.netTotalWithDiscount!;
          this.invoicedAmount = this.orderUpdate.invoicedAmount!;
          this.remitAmount = this.orderUpdate.remitAmount!;
          this.ivaAmount = this.orderUpdate.ivaAmount!;
          this.total = this.orderUpdate.total!;
        }
      }

  ngOnInit(): void {
    this.priceListService.findAll()
      .subscribe({
        next: res => {
          this.priceLists = res;
        },
        error: () => {
          this.message.add({ severity: 'error', summary: 'ERROR!',
            detail: 'Ha ocurrido un error al intentar obtener todas las Listas de precios.'});
        }
      });
    this.deliveryService.findAll()
      .subscribe({
        next: res => {
          this.deliveries = res;
        },
        error: () => {
          this.message.add({ severity: 'error', summary: 'ERROR!',
            detail: 'Ha ocurrido un erro al intentar obtener todos los Transportes.'});
        }
      });
    this.customerService.findAll()
      .subscribe({
        next: res => {
          this.customers = res;
        },
        error: () => {
          this.message.add({ severity: 'error', summary: 'ERROR!',
            detail: 'Ha ocurrido un error al intentar obtener todos los Clientes.'});
        }
      });
  }

  get discounts(): FormArray {
    return <FormArray>this.orderForm.get('discounts');
  }

  addDiscount(discount?: number): void {
    this.discounts.push(this.fb.group({
      discount: [discount ? discount : 0, [Validators.required]]
    }));
  }

  removeDiscount(itemIndex: number): void {
    this.discounts.removeAt(itemIndex);
    this.selectProductsEvent(true);
  }

  isSubmitDisabled(): boolean | null {
    return this.orderForm.invalid || this.selectedProductsDisplayed.length === 0;
  }

  onSubmit(): void {
    if(this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }
    this.loadingSubmit = true;
    const discountNumberArray: Array<number> = this.discounts.value.map(function(val: any) {
      return val.discount;
    });
    if(this.orderUpdate._id) {
      this.orderUpdate = { ...this.orderForm.value, _id: this.orderUpdate._id,customer: this.selectedCustomer, discounts: discountNumberArray, productsCart: this.selectedProductsDisplayed,
        invoicedAmount: this.invoicedAmount, remitAmount: this.remitAmount, ivaAmount: this.ivaAmount, 
        netTotalWithDiscount: this.netTotalWithDiscount, netTotal: this.netTotal, total: this.total, cascadeDiscount: this.finalDiscount };
      this.orderService.update(this.orderUpdate)
        .subscribe({
          next: () => {
            this.loadingSubmit = false;
            this.router.navigateByUrl('main/pending-orders');
          },
          error: () => {
            this.message.add({ severity: 'error', summary: 'ERROR!',
              detail: 'Ha ocurrido un error al intentar modificar un Pedido.'});
          }
        });
    } else {
      const orderCreate: Order = { ...this.orderForm.value, cascadeDiscount: this.finalDiscount, customer: this.selectedCustomer, discounts: discountNumberArray, productsCart: this.selectedProductsDisplayed,
        invoicedAmount: this.invoicedAmount, remitAmount: this.remitAmount, ivaAmount: this.ivaAmount, 
        netTotalWithDiscount: this.netTotalWithDiscount, netTotal: this.netTotal, total: this.total };
      this.orderService.create(orderCreate)
        .subscribe({
          next: () => {
            this.router.navigateByUrl('main/pending-orders');
          },
          error: () => {
            this.message.add({ severity: 'error', summary: 'ERROR!',
              detail: 'Ha ocurrido un error al intentar crear un nuevo Pedido.'});
          }
        });
    }
  }

  isValid(field: string): boolean | null {
    return this.orderForm.controls[field].errors
      && this.orderForm.controls[field].touched;
  }

  customerSelection(): void {
    this.products = [];
    if(this.selectedCustomer !== null && this.selectedCustomer._id) {
      this.setCustomersValues();
      this.showCustomers = false;
    } else {
      this.message.add({ severity: 'warn', summary: 'Advertencia', detail: 'Asegurese de seleccionar un cliente primero.'});
    }
  }

  setCustomersValues(): void {
      this.orderForm.get('customer')?.setValue(this.selectedCustomer.name);
      this.orderForm.get('priceList')?.setValue(this.selectedCustomer.priceList);
      let customerFactories = this.selectedCustomer.discountsByFactory?.map(value => {
        return value.factory;
      });
      this.factories = customerFactories!;
  }

  factorySelection(): void {
    let selectedFactory = this.orderForm.get('factory')!.value;
    let customerFactory: CustomerFactory = this.selectedCustomer
      .discountsByFactory?.find(val => val.factory._id === selectedFactory._id)!;
    this.orderForm.get('delivery')?.setValue(customerFactory.delivery);
    this.orderForm.get('customerDiscount')?.setValue((customerFactory.cascadeDiscount*100).toFixed(2));
    console.log(customerFactory.cascadeDiscount*100);
    this.loadProducts();
  }

  // leave only one return
  loadProducts(selectedProducts?: Array<Cart>): void {

    const factory: Factory = this.orderForm.get('factory')?.value;
    if(this.orderForm.get('factory')?.value !== '') {
      this.productService.findAll(factory._id!)
        .subscribe({
          next: res => {
            this.products = res.map(value => {
              let price  = value.pricesByList.find(value => value.priceList._id === this.orderForm.get('priceList')?.value._id);
              let cart: Cart = { product: value, price: price?.price!, quantity: 1, bonus: 0, subtotal: price?.price!};
              if(selectedProducts) {
                selectedProducts.forEach(val => {
                  if(val.product._id === value._id) {
                    cart = val;
                  }
                });
                return cart;
              } else {
                return cart;
              }
            });
          },
          error: () => {
            this.message.add({ severity: 'error', summary: 'ERROR!',
              detail: 'Ha ocurrido un error al intentar obtener todos los Productos.'});
          }
        });     
    }
  }

  calculatedSubtotal(product: Cart): void {
    product.subtotal = product.quantity * product.price; 
  }

  selectProductsEvent(remove: boolean): void {
      if(this.orderForm.get('invoicedPercent')?.value !== '') {
      this.showProducts = false;
      this.netTotal = this.selectedProducts.reduce(
        (acc, cu) => acc + cu.subtotal, 0,
      )
      this.finalDiscount = this.calculateFinalDiscount() !== 0 ?
      (1 - (1 - this.calculateFinalDiscount()) * (1 - this.orderForm.get('customerDiscount')?.value/100)) 
      : this.orderForm.get('customerDiscount')?.value/100;
      this.netTotalWithDiscount = this.netTotal - (this.netTotal*this.finalDiscount);
      this.invoicedAmount = this.netTotalWithDiscount*this.orderForm.get('invoicedPercent')?.value.percentNumber;
      this.remitAmount = this.netTotalWithDiscount - this.invoicedAmount;
      this.ivaAmount = (this.invoicedAmount*0.21);
      this.total = this.invoicedAmount + this.remitAmount + this.ivaAmount;
      this.selectedProductsDisplayed = this.selectedProducts;
    } else {
      if(!remove) this.message.add({ severity: 'warn', summary: 'Aviso!', detail: 'Seleccione el porcentaje facturado antes que los productos'});
    }
    
  }

  deleteProductFromSelection(product: Cart): void {
    this.selectedProducts = this.selectedProducts.filter(value => value.product._id !== product.product._id);
    this.selectedProductsDisplayed = this.selectedProducts;
    this.selectProductsEvent(true);
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

  changeSelectedPriceList(): void {
    this.selectedProducts = [];
    this.selectedProductsDisplayed = [];
    this.loadProducts();
  }
}
