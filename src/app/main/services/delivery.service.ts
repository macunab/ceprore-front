import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Delivery } from '../interfaces/delivery.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Customer } from '../interfaces/customer.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  private readonly url: string = `${environment.baseUrl}/delivery`;

  constructor(private http: HttpClient) { }

  create(delivery: Delivery) { }


  findAll(): Observable<Array<Customer> | boolean> { 
    
    const token = localStorage.getItem('token');
    if(!token) {
      return of(false);
    }
    const headers = new HttpHeaders()
      .set('Authorization', `Beared ${token}`);
    return this.http.get<Array<Customer>>(this.url, { headers })
  }

  update(delivery: Delivery) { }

  delete(id: string) { }

}
