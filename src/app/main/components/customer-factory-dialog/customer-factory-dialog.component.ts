import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Factory } from '../../interfaces/factory.interface';
import { Delivery } from '../../interfaces/delivery.interface';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

//temporal fix
export interface ArrayDiscount {
  discount: number;
}

@Component({
  selector: 'app-customer-factory-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, DropdownModule, ButtonModule, 
    InputTextModule, CommonModule, TooltipModule],
  templateUrl: './customer-factory-dialog.component.html',
  styleUrl: './customer-factory-dialog.component.css'
})
export class CustomerFactoryDialogComponent {

  @Output('onClose') emmiter = new EventEmitter();
  factoryDiscountForm: FormGroup = this.fb.group({
    factory: ['', [Validators.required]],
    delivery: ['', [Validators.required]],
    discounts: this.fb.array([]),
    cascadeDiscount: [0]
  });
  factories: Array<Factory> = [
    { _id: '1111', name: 'Factory1', address: 'San juan 123', email: 'factory1@gmail.com' },
    { _id: '2222', name: 'Factory2', address: 'Ituzaingo 123', email: 'factory2@gmail.com' },
    { _id: '3333', name: 'Factory3', address: 'Simon Bolivar 123', email: 'factory3@gmail.com' }
  ];
  deliveries: Array<Delivery> = [
    { _id: '1111', name: 'Transporte La Calera', address: 'Simon Bolivar 2321', email: 'transporteCalera@gmail.com' }
  ];

  constructor(private fb: FormBuilder) {}

  get discounts(): FormArray {
    return <FormArray>this.factoryDiscountForm.get('discounts');
  }

  createDiscount(): FormGroup {
    return this.fb.group({
      discount: [0, [Validators.required]]
    });
  }

  addDiscount(): void {
    this.discounts.push(this.createDiscount());
  }

  removeDiscount(itemIndex: number): void {
    //console.log(this.discounts.at(itemIndex).value, itemIndex);
    this.discounts.removeAt(itemIndex);
  }

  // Perfomance fix todo
  onSubmit() {
    if(this.factoryDiscountForm.invalid) {
      this.factoryDiscountForm.markAllAsTouched();
      return;
    }
    let toArray: Array<number> = this.discounts.value.map( function(val: any) {
      return val.discount;
    })
    if(toArray.length) {
      console.log('ENTRA A TOARRAY')
      const realDiscount = toArray.reduce((acc, cu) => {
        let count = (acc >= 1) ? (1-(acc/100))*(1-(cu/100)) : ((acc) * (1-(cu/100)));
        return count;
      });
      this.factoryDiscountForm.get('cascadeDiscount')?.setValue((realDiscount >= 1 || realDiscount == 0) ? realDiscount/100 : (1-realDiscount));
    } else {
      this.factoryDiscountForm.get('cascadeDiscount')?.setValue(0);
    }
    this.emmiter.emit({ data: this.factoryDiscountForm.value });
  }

  cleanForm() {
    this.discounts.clear();
    this.factoryDiscountForm.reset();
  }

  isValid(field: string): boolean | null {
    return this.factoryDiscountForm.controls[field].errors 
      && this.factoryDiscountForm.controls[field].touched;
  }
}
