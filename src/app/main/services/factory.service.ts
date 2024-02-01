import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Factory } from '../interfaces/factory.interface';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactoryService {

  private readonly baseUrl: string = `${environment.baseUrl}/factory`;

  constructor(private http: HttpClient) { }

  create(factory: Factory): Observable<Factory> {

    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.post<Factory>(this.baseUrl, factory, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`)
        })
      );
  }

  findAll(): Observable<Array<Factory>> {

    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.get<Array<Factory>>(this.baseUrl, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`)
        })
      );
  }

  update(factory: Factory): Observable<Factory> {

    const { _id, ...factoryData } = factory;
    const url: string = `${this.baseUrl}/${_id}`;
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.patch<Factory>(url, factoryData, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`)
        })
      );
  }

  delete(id: string): Observable<Factory> {

    const url: string = `${this.baseUrl}/${id}`;
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.delete<Factory>(url, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`)
        })
      );
  }
}
