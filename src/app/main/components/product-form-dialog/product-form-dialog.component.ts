import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

import { Product, ProductPrice } from '../../interfaces/product.interface';
import { PriceList } from '../../interfaces/priceList.interface';
import { Factory } from '../../interfaces/factory.interface';
import { DropdownModule } from 'primeng/dropdown';
import { FactoryService } from '../../services/factory.service';
import { PriceListService } from '../../services/price-list.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputTextModule, InputNumberModule, ButtonModule,
     CommonModule, DropdownModule, DividerModule],
  templateUrl: './product-form-dialog.component.html',
  styleUrl: './product-form-dialog.component.css'
})
export class ProductFormDialogComponent implements OnChanges, OnInit{
  
  @Output('onClose') emmiter = new EventEmitter();
  @Input() productUpdate!: Product;
  productForm: FormGroup = this.fb.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    description: [''],
    boxesPerPallet: [0],
    unitsPerBox: [0],
    factory: ['', [Validators.required]],
    pricesByList: this.fb.array([])
  });
  priceLists: Array<PriceList> = [{ _id: '1111', name: 'Supermercados'}, { _id: '2222', name: 'Kioscos' }];
  factories: Array<Factory> = [
    { _id: '1111', name: 'Factory1', address: 'San juan 123', email: 'factory1@gmail.com' },
    { _id: '2222', name: 'Factory2', address: 'Ituzaingo 123', email: 'factory2@gmail.com' },
    { _id: '3333', name: 'Factory3', address: 'Simon Bolivar 123', email: 'factory3@gmail.com' }
  ];

  constructor(private fb: FormBuilder, private factoryService: FactoryService,
    private priceListService: PriceListService) {}

  ngOnInit(): void {
    this.priceListService.findAll()
      .subscribe({
        next: res => this.priceLists = res,
        error: err => {
          console.log(err);
        }
      });
    this.factoryService.findAll()
      .subscribe({
        next: res => this.factories = res,
        error: err => {
          console.log(err);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.productUpdate._id) {
      this.pricesByList.clear();
      this.productForm.patchValue(this.productUpdate);
    } else {
      console.log('ENTRA EN EL CREATE');
    }
  }

  get pricesByList(): FormArray {
    return <FormArray>this.productForm.get('pricesByList');
  }

  setUpdatePricesArray(prices: Array<ProductPrice>) {
    this.priceLists.forEach( val => {
      let price: number = 0;
      prices.map( p => {
        if(p.priceList.name === val.name) {
          price = p.price;
        }
      });
      const priceFormGroup: FormGroup = this.createPrice(val, price);
      this.pricesByList.push(priceFormGroup);
    });
  }

  createPrice(priceList: PriceList, price?: number): FormGroup {
    return this.fb.group({
      priceList: [priceList],
      price: [price ? price : 0, [Validators.required]]
    });
  }

  onSubmit(): void {
    if(this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    if(this.productUpdate._id) {
      this.productUpdate = { _id: this.productUpdate._id, ...this.productForm.value };
      this.emmiter.emit({ data: this.productUpdate });
    } else {
      this.emmiter.emit({ data: this.productForm.value });
    }
}

isValid(field: string): boolean | null {
  return this.productForm.controls[field].errors 
    && this.productForm.controls[field].touched;
}

setInitialPriceByList(): void {
    this.priceLists.forEach((list) => {
      this.pricesByList.push(this.createPrice(list));
    });
}

onHide(): void {
  this.pricesByList.clear();
  this.productForm.reset();
}

}
