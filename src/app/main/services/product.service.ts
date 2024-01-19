import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interfaces/product.interface';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly baseUrl: string = `${environment.baseUrl}/product`;

  constructor(private http: HttpClient) { }

  create(product: Product): Observable<Product> {

    return this.http.post<Product>(this.baseUrl, product)
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`)
        })
      );
  } 

  findAll(): Observable<Array<Product>> {

    return this.http.get<Array<Product>>(this.baseUrl)
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`)
        })
      );
  }

  update(product: Product): Observable<Product> {

    const { _id, ...productData } = product;
    const url: string = `${this.baseUrl}/${_id}`;
    return this.http.patch<Product>(url, productData)
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`)
        })
      );
  }

  delete(id: string): Observable<Product> {

    const url: string = `${this.baseUrl}/${id}`;
    return this.http.delete<Product>(url)
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`)
        })
      );
  }
}
