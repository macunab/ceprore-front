import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { PriceList } from '../interfaces/priceList.interface';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriceListService {

  // TODO ADD JWT HEADER

  private readonly baseUrl: string = `${environment.baseUrl}/price-list`;

  constructor(private http: HttpClient) { }

  findAll(): Observable<Array<PriceList>> {
    
    return this.http.get<Array<PriceList>>(this.baseUrl);
  }

  create(priceList: PriceList): Observable<PriceList> {

    return this.http.post<PriceList>(this.baseUrl, priceList);
  }

  edit(priceList: PriceList): Observable<PriceList> {

    const { _id, name } = priceList;
    const url: string = `${this.baseUrl}/${_id}`
    return this.http.patch<PriceList>(url, { name })
  }

  delete(id: string): Observable<PriceList | boolean> {

    const url: string = `${this.baseUrl}/${id}`;
    return this.http.delete<PriceList>(url)
      .pipe(
        catchError(error => of(false))
      );
  }
}
