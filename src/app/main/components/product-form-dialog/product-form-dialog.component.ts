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
    boxesPallet: [0],
    unitsBox: [0],
    factory: ['', [Validators.required]],
    pricesByList: this.fb.array([])
  });
  priceLists: Array<PriceList> = [{ id: '1111', name: 'Supermercados'}, { id: '2222', name: 'Kioscos' }];
  factories: Array<Factory> = [
    { id: '1111', name: 'Factory1', address: 'San juan 123', email: 'factory1@gmail.com' },
    { id: '2222', name: 'Factory2', address: 'Ituzaingo 123', email: 'factory2@gmail.com' },
    { id: '3333', name: 'Factory3', address: 'Simon Bolivar 123', email: 'factory3@gmail.com' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log('SE LLAMA AL INIT')
    // get priceList/factories from service then
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if(this.productUpdate.id) {
      //this.pricesByList.clear();
      console.table(this.productUpdate);
      this.productForm.patchValue(this.productUpdate);
      this.setUpdatePricesArray(this.productUpdate.pricesByList);
      // this.priceLists.forEach(list => {
      //   let isCreated: boolean = false;
      //   this.productUpdate.pricesByList.forEach( value => {
      //     if(list.id === value.list.id) {
      //       this.pricesByList.push(this.createPrice(list, value.price));
      //       isCreated = true;
      //     }
      //   });
      //   if(!isCreated) {
      //     this.pricesByList.push(this.createPrice(list));
      //   }
      // });
    } else {
      console.error('ENTRO AL CREATE');
      //this.pricesByList.clear();
     // this.pricesByList.clear();
      this.setInitialPriceByList();
    }
  }

  get pricesByList(): FormArray {
    return <FormArray>this.productForm.get('pricesByList');
  }

  setUpdatePricesArray(prices: Array<ProductPrice>) {
    prices.map( p => {
      const priceForm = this.createPrice(p.list, p.price);
      this.pricesByList.push(priceForm);
    })
  }

  createPrice(priceList: PriceList, price?: number): FormGroup {
    console.log('EL VALOR DE PRICE ES: ', price);
    return this.fb.group({
      list: [priceList],
      price: [price ? price : 0, [Validators.required]]
    });
  }

  onSubmit(): void {
    if(this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    if(this.productUpdate.id) {
      this.productUpdate = { id: this.productUpdate.id, ...this.productForm.value };
      this.emmiter.emit({ data: this.productUpdate });
    } else {
      console.log(this.productForm.value);
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
