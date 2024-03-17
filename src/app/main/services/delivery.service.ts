import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Delivery } from '../interfaces/delivery.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  private readonly baseUrl: string = `${environment.baseUrl}/delivery`;

  constructor(private http: HttpClient) { }

  create(delivery: Delivery): Observable<Delivery> { 

    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.post<Delivery>(this.baseUrl, delivery, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`);
        })
      )
  }

  findAll(): Observable<Array<Delivery>> { 
    
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.get<Array<Delivery>>(this.baseUrl, { headers })
      .pipe(
        catchError( error => {
          return throwError(() => `Error: ${error.error.message}`)
        })
      );
  }

  update(delivery: Delivery): Observable<Delivery> {

    const { _id, ...deliveryData } = delivery;
    const url: string = `${this.baseUrl}/${_id}`;
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.patch<Delivery>(url, deliveryData, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`)
        })
      );
   }

  delete(id: string): Observable<Delivery> {

    const url: string = `${this.baseUrl}/${id}`;
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.delete<Delivery>(url, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`)
        })
      );
   }
}
