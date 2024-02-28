import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { ButtonConfig, Column, TableEvent } from '../../../shared/interfaces/genericTable.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { GenericTableComponent } from '../../../shared/generic-table/generic-table.component';
import { ProductFormDialogComponent } from '../../components/product-form-dialog/product-form-dialog.component';
import { DialogData } from '../../interfaces/dialogData.interface';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [GenericTableComponent, ConfirmDialogModule, ToastModule, DialogModule, 
    ProductFormDialogComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  providers: [ConfirmationService, MessageService]
})
export class ProductsComponent implements OnInit{

  products: Array<Product> = [];
  buttons: Array<ButtonConfig> = [
    { class: 'p-button-sm p-button-info p-button-rounded p-button-text mr-2', 
        functionType: 'edit', icon: 'pi pi-pencil', tooltipText: 'Editar' },
    { class: 'p-button-sm p-button-danger p-button-rounded p-button-text mr-2', 
        functionType: 'delete', icon: 'pi pi-trash', tooltipText: 'Eliminar' }
  ];
  filters: Array<string> = ['code', 'name', 'description'];
  headers: Array<Column<Product>> = [
    { field: 'code', title: 'Codigo' },
    { field: 'name', title: 'Nombre' },
    { field: 'description', title: 'Descripcion' }
  ];
  tableTitle: string = 'Productos';
  formTitle: string = '';
  showForm: boolean = false;
  productUpdate: Product = {} as Product;
  @ViewChild(ProductFormDialogComponent) formDialog!: ProductFormDialogComponent;
  loadingTable: boolean = true;
  loadingButton: boolean = false;

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService,
    private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.findAll()
      .subscribe({
        next: res => {
          this.products = res;
          this.loadingTable = false;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'ERROR!', 
            detail: 'Ha ocurrido un error al intentar obtener todos los Productos'});
        }
      });
  }

  onActions(action: TableEvent<Product>): void {
    switch(action.type) {
      case 'edit':
        this.editProduct(action.data);
      break;
      case 'delete':
        this.deleteProduct(action.data);
      break;
      case 'create':
        this.createProduct();
      break;
    }
  }

  editProduct(product: Product): void {
      this.formTitle = 'Editar Producto';
      this.productUpdate = product;
      this.showForm = true;
  }

  deleteProduct(product: Product): void {
    this.confirmationService.confirm({
      message: `Desea eliminar el producto: "${product.name}"?`,
      header: 'Eliminar Producto',
      icon: 'pi pi-info-delete',
      accept: () => {
        this.productService.delete(product._id!)
          .subscribe({
            next: res => {
              this.products = this.products.filter(value => value._id !== res._id);
              this.products = [...this.products];
              this.messageService.add({ severity: 'success', summary: 'Informacion',
                detail: `El Producto: "${res.name}", se ha eliminado exitosamente`});
            },
            error: () => {
              this.messageService.add({ severity: 'error', summary: 'ERROR!',
                detail: `Ha ocurrido un error al intentar eliminar el Producto: "${product.name}"`});
            }
          })
      }
    });
  }

  createProduct(): void {
    this.formTitle = 'Nuevo Producto';
    this.productUpdate = {} as Product;
    this.showForm = true;
  }

  onFormClose(dialogData: DialogData<Product>): void {

    this.loadingButton = true;
    if(dialogData.data._id) {
      this.productService.update(dialogData.data)
        .subscribe({
          next: res => {
            const index = this.products.findIndex(value => value._id === res._id);
            (index !== -1) ? this.products[index] = res : '';
            this.products = [...this.products];
            this.messageService.add({ severity: 'success', summary: 'Informacion',
              detail: `El Producto: "${res.name}", se ha modificado exitosamente.`});
            this.showForm = false;
            this.loadingButton = false;  
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'ERROR!',
              detail: `Ha ocurrido un error al intentar modificar el Producto: "${dialogData.data.name}"`});
            this.loadingButton = false;
          }
        })
    } else {
      this.productService.create(dialogData.data)
        .subscribe({
          next: res => {
            this.products.push(res);
            this.products = [...this.products];
            this.messageService.add({ severity: 'success', summary: 'Informacion',
              detail: `El Producto: "${res.name}", se ha creado exitosamente.`});
            this.showForm = false;
            this.loadingButton = false;
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'ERROR!',
              detail: 'Ha ocurrido un error al intentar crear un nuevo Producto.'});
            this.loadingButton = false;
          }
      })
    }
  }

  onHide(): void {
    this.formDialog.onHide();
  }

  onShow(): void {
    if(this.productUpdate._id) {
      this.formDialog.productForm.patchValue(this.productUpdate);
      this.formDialog.setUpdatePricesArray(this.productUpdate.pricesByList);
    } else {
      this.formDialog.pricesByList.clear();
      this.formDialog.setInitialPriceByList();
    }
  }

}
