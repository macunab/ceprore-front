import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Factory } from '../interfaces/factory.interface';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactoryService {

  // ToDo JWT headers for GUARDs

  private readonly baseUrl: string = `${environment.baseUrl}/factory`;

  constructor(private http: HttpClient) { }

  create(factory: Factory): Observable<Factory> {

    return this.http.post<Factory>(this.baseUrl, factory)
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`)
        })
      );
  }

  findAll(): Observable<Array<Factory>> {

    return this.http.get<Array<Factory>>(this.baseUrl)
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`)
        })
      );
  }

  update(factory: Factory): Observable<Factory> {

    const { _id, ...factoryData } = factory;
    const url: string = `${this.baseUrl}/${_id}`;
    return this.http.patch<Factory>(url, factoryData)
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`)
        })
      );
  }

  delete(id: string): Observable<Factory> {

    const url: string = `${this.baseUrl}/${id}`;
    return this.http.delete<Factory>(url)
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`)
        })
      );
  }
}
