import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Order } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly baseUrl: string = `${environment.baseUrl}/order`;

  constructor(private http: HttpClient) { }

  create(order: Order): Observable<Order> {

    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.post<Order>(this.baseUrl, order, { headers })
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`);
        })
      );
  }

  findAll(query: string): Observable<Array<Order>> {

    query = query.trim();
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    const options = query ?
      { params: new HttpParams().set('status', query), headers } : {};

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
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.patch<Order>(url, orderData, { headers })
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`);
        })
      );
  }

  removeInvoice(order: Order): Observable<Order> {
    const { _id, ...orderData } = order;
    const url: string = `${this.baseUrl}/invoice-delete/${_id}`;
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.patch<Order>(url, orderData, { headers })
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`)
        })
      );
  }

  removePayment(order: Order): Observable<Order> {

    const { _id, ...orderData } = order;
    const url: string = `${this.baseUrl}/payment-delete/${_id}`;
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.patch<Order>(url, orderData, { headers })
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`)
        })
      );
  }

  delete(id: string): Observable<Order> {

    const url: string = `${this.baseUrl}/${id}`;
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.delete(url, { headers })
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`);
        })
      );
  }

  printPending(order: Order): Observable<Blob> {

    const { _id, createdAt, updatedAt, __v, ...orderData } = order;
    const url: string = `${this.baseUrl}/pdf`;
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.post(url, orderData, { responseType: 'blob', headers })
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`);
        })
      );
  }

  printInvoice(order: Order): Observable<Blob> {

    const { _id, createdAt, updatedAt, __v, ...orderData } = order;
    const url: string = `${this.baseUrl}/invoice-pdf`;
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.post(url, orderData, { responseType: 'blob', headers })
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`)
        })
      );

  }

  printPayment(order: Order) {

    const { _id, createdAt, updatedAt, __v, ...orderData } = order;
    const url: string = `${this.baseUrl}/payment-pdf`;
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.post(url, orderData, { responseType: 'blob', headers })
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`)
        })
      );
  }

  countAllOrders(query?: string): Observable<number> {

    query = query?.trim();
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    const options = query ? 
      { params: new HttpParams().set('status', query), headers } : {};
    const url: string = `${this.baseUrl}/count`;
    return this.http.get<number>(url, options)
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`)
        })
      );
  }

  countAllOrdersLastWeek(query?: string): Observable<number> {

    query = query?.trim();
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    const options = query ? 
      { params: new HttpParams().set('status', query ), headers } : {};
    const url: string = `${this.baseUrl}/count-lastweek`;
    return this.http.get<number>(url, options)
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`)
        })
      );
  }
}
