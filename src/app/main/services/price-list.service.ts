import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PriceList } from '../interfaces/priceList.interface';
import { Observable, catchError, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriceListService {

  private readonly baseUrl: string = `${environment.baseUrl}/price-list`;

  constructor(private http: HttpClient) { }

  findAll(): Observable<Array<PriceList>> {
    
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.get<Array<PriceList>>(this.baseUrl, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`);
        })
      );
  }

  create(priceList: PriceList): Observable<PriceList> {

    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.post<PriceList>(this.baseUrl, priceList, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`);
        })
      );
  }

  edit(priceList: PriceList): Observable<PriceList> {

    const { _id, name } = priceList;
    const url: string = `${this.baseUrl}/${_id}`;
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.patch<PriceList>(url, { name }, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`);
        })
      );
  }

  delete(id: string): Observable<PriceList> {

    const url: string = `${this.baseUrl}/${id}`;
    const headers = new HttpHeaders()
    .set('authorization', `Beared ${localStorage.getItem('token')}`);
    return this.http.delete<PriceList>(url, { headers })
      .pipe(
        catchError(error => {
          return throwError(() => `Error: ${error.error.message}`);
        })
      );
  }
}
