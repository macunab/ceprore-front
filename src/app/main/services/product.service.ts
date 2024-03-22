import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Product } from '../interfaces/product.interface';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly baseUrl: string = `${environment.baseUrl}/product`;

  constructor(private http: HttpClient) { }

  create(product: Product): Observable<Product> {

    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.post<Product>(this.baseUrl, product, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`)
        })
      );
  } 

  findAll(query?: string): Observable<Array<Product>> {

    query = query?.trim();
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    
    const options = query ? 
      { params: new HttpParams()
        .set('factory', query)
        .set('isDeleted', false), headers } : { params: new HttpParams()
          .set('isDeleted', false), headers };
    return this.http.get<Array<Product>>(this.baseUrl, options)
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`)
        })
      );
  }

  findByFactory(factoryId: string): Observable<Array<Product>> {

    const url: string = `${this.baseUrl}/${factoryId}`;
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);

    const options = { params: new HttpParams()
      .set('factory', factoryId)
      .set('isDeleted', false), headers };

    return this.http.get<Array<Product>>(url, options)
    .pipe(
      catchError(error => {
        return throwError(() => `Error: ${error.error.message}`)
      })
    );
  }

  update(product: Product): Observable<Product> {

    const { _id, ...productData } = product;
    const url: string = `${this.baseUrl}/${_id}`;
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.patch<Product>(url, productData, { headers })
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`)
        })
      );
  }

  delete(id: string): Observable<Product> {

    const url: string = `${this.baseUrl}/${id}`;
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.delete<Product>(url, { headers })
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`)
        })
      );
  }
}
