import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PriceList } from '../../interfaces/priceList.interface';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-price-list-form-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, CommonModule],
  templateUrl: './price-list-form-dialog.component.html',
  styleUrl: './price-list-form-dialog.component.css'
})
export class PriceListFormDialogComponent implements OnChanges{
 
  @Output('onClose') emmiter = new EventEmitter();
  @Input() priceListUpdate!: PriceList;
  @Input() loadingButton: boolean = false;
  priceListForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if(this.priceListUpdate._id) {
      this.priceListForm.patchValue(this.priceListUpdate);
    } else {
      if(!changes['loadingButton']) {
        this.priceListForm.reset();
      }
    }
  }

  onSubmit(): void {
    if(this.priceListForm.invalid) {
      this.priceListForm.markAllAsTouched();
      return;
    }
    if(this.priceListUpdate._id) {
      this.priceListUpdate = { _id: this.priceListUpdate._id, ...this.priceListForm.value };
      this.emmiter.emit({ data: this.priceListUpdate });
    } else {
      this.emmiter.emit({ data: this.priceListForm.value });
    }
  }

  isValid(field: string): boolean | null {
    return this.priceListForm.controls[field].errors
      && this.priceListForm.controls[field].touched;
  }

}
