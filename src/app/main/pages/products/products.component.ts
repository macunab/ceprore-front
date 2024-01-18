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

  products: Array<Product> = [
    { id: '1111', code: 'CA-1231', name: 'Gallete Cracker', description: 'Galleta cracker multicereal Ceralmix. Fabrica Otonello',
        boxesPallet: 10, unitsBox: 24, factory: { id: '1111', name: 'factory1', address: 'asdasdasd', email: 'asas@gmail.com'},
        pricesByList: [{ list: { _id: '1111', name: 'Supermercados' }, price: 150 }, { list: {_id: '2222', name: 'Kioscos'}, price: 170 }] }
  ];
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

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

  ngOnInit(): void {
    // service get Products list
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
        try {
          // deleteProduct service.. if ok then...
          this.products = this.products.filter(value => value.id !== product.id);
          this.products = [...this.products];
          this.messageService.add({ severity: 'info', summary: 'Informacion',
            detail: `El producto: "${product.name}", se ha eliminado exitosamente!`});
        } catch(error) {
          this.messageService.add({ severity: 'error', summary: 'ERROR!', 
            detail: `Ha ocurrido un error al intentar eliminar el producto: "${product.name}"`})
        }
      }
    });
  }

  createProduct(): void {
    this.formTitle = 'Nuevo Producto';
    this.productUpdate = {} as Product;
    this.showForm = true;
  }

  onFormClose(dialogData: DialogData<Product>): void {
    console.log(dialogData.data);
    this.showForm = false;
    if(dialogData.data.id) {
      // update service
      console.info('SE VA A INTERTAR EDITAR UN PRODUCTO');
      const index = this.products.findIndex(value => value.id === dialogData.data.id);
      (index !== -1) ? this.products[index] = dialogData.data : '';
      this.products = [...this.products];
    } else {
      console.info('SE VA A INTENTAR CREAR UN PRODUCTO');
      try {
        // create product service function.
        dialogData.data.id = '12312312'; // only for tests.. in production use the service result.
        this.products.push(dialogData.data);
        this.products = [...this.products];
      } catch(error) {
        this.messageService.add({ severity:'error', summary: 'ERROR!', 
          detail: 'Ha ocurrido un error al intentar crear un nuevo producto'});
      }
    }
  }

  onHide(): void {
    this.formDialog.onHide();
  }

  onShow(): void {
    if(this.productUpdate.id) {
      this.formDialog.productForm.patchValue(this.productUpdate);
      this.formDialog.setUpdatePricesArray(this.productUpdate.pricesByList);
    } else {
      this.formDialog.pricesByList.clear();
      this.formDialog.setInitialPriceByList();
    }
  }

}
