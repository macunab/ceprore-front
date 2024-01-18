import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Delivery } from '../interfaces/delivery.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Customer } from '../interfaces/customer.interface';
import { Observable, catchError, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  private readonly baseUrl: string = `${environment.baseUrl}/delivery`;

  constructor(private http: HttpClient) { }

  create(delivery: Delivery): Observable<Delivery> { 

    return this.http.post<Delivery>(this.baseUrl, delivery)
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`);
        })
      )
  }

  findAll(): Observable<Array<Delivery>> { 
    
    // const token = localStorage.getItem('token');
    // const headers = new HttpHeaders()
    //   .set('Authorization', `Beared ${token}`);
    return this.http.get<Array<Delivery>>(this.baseUrl)
      .pipe(
        catchError( error => {
          return throwError(() => `Error: ${error.error.message}`)
        })
      );
  }

  update(delivery: Delivery): Observable<Delivery> {

    const { _id, ...deliveryData } = delivery;
    const url: string = `${this.baseUrl}/${_id}`;
    return this.http.patch<Delivery>(url, deliveryData)
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`)
        })
      );
   }

  delete(id: string): Observable<Delivery> {

    const url: string = `${this.baseUrl}/${id}`;
    return this.http.delete<Delivery>(url)
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`)
        })
      );
   }

}
