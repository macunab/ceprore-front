import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Order } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly baseUrl: string = `${environment.baseUrl}/order`;

  constructor(private http: HttpClient) { }

  create(order: Order): Observable<Order> {

    return this.http.post<Order>(this.baseUrl, order)
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`);
        })
      );
  }

  findAll(query: string): Observable<Array<Order>> {

    query = query.trim();
    const options = query ?
      { params: new HttpParams().set('status', query) } : {};

    return this.http.get<Array<Order>>(this.baseUrl, options)
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`);
        })
      );
  }

  update(order: Order): Observable<Order> {

    const { _id, ...orderData } = order;
    const url: string = `${this.baseUrl}/${_id}`;
    return this.http.patch<Order>(url, orderData)
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`);
        })
      );
  }

  removeInvoice(order: Order): Observable<Order> {
    const { _id, ...orderData } = order;
    const url: string = `${this.baseUrl}/invoice-delete/${_id}`;
    return this.http.patch<Order>(url, orderData)
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`)
        })
      );
  }

  delete(id: string): Observable<Order> {

    const url: string = `${this.baseUrl}/${id}`;
    return this.http.delete(url)
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`);
        })
      );
  }

  printPending(order: Order): Observable<Blob> {

    const { _id, createdAt, updatedAt, __v, ...orderData } = order;
    const url: string = `${this.baseUrl}/pdf`;
    return this.http.post(url, orderData, { responseType: 'blob' })
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`);
        })
      );
  }

  printInvoice(order: Order) {

  }

  printPayment(order: Order) {

  }
}
