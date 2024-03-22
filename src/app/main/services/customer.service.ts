import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Customer } from '../interfaces/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly baseUrl: string = `${environment.baseUrl}/customer`;

  constructor(private http: HttpClient) { }

  findAll(): Observable<Array<Customer>> {

    const headers = new HttpHeaders()
      .set('authorization', `Beared ${localStorage.getItem('token')}`);
    
    const options = {
      params: new HttpParams()
        .set('isDeleted', false),
      headers
    }
    return this.http.get<Array<Customer>>(this.baseUrl, options)
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`);
        })
      )
  }

  update(customer: Customer): Observable<Customer> {

    const { _id, ...customerData } = customer;
    const url: string = `${this.baseUrl}/${_id}`;
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.patch<Customer>(url, customerData, { headers })
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`);
        })
      )
  }

  delete(id: string): Observable<Customer> {

    const url: string = `${this.baseUrl}/${id}`;
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.delete<Customer>(url, { headers })
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`)
        })
      );
  }

  create(customer: Customer): Observable<Customer> {

    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.post<Customer>(this.baseUrl, customer, { headers })
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`)
        })
      );
  }

  countAllCustomers(query?: string): Observable<number> {

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
}
