import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Customer } from '../interfaces/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  // ToDo JWT headers

  private readonly baseUrl: string = `${environment.baseUrl}/customer`;

  constructor(private http: HttpClient) { }

  findAll(): Observable<Array<Customer>> {

    return this.http.get<Array<Customer>>(this.baseUrl)
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`);
        })
      )
  }

  update(customer: Customer): Observable<Customer> {

    const { _id, ...customerData } = customer;
    const url: string = `${this.baseUrl}/${_id}`;
    return this.http.patch<Customer>(url, customerData)
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`);
        })
      )
  }

  delete(id: string): Observable<Customer> {

    const url: string = `${this.baseUrl}/${id}`;
    return this.http.delete<Customer>(url)
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`)
        })
      );
  }

  create(customer: Customer): Observable<Customer> {

    return this.http.post<Customer>(this.baseUrl, customer)
      .pipe(
        catchError(({error}) => {
          return throwError(() => `Error: ${error.message}`)
        })
      );
  }

}
