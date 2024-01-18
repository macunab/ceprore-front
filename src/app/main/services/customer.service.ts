import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly url: string = `${environment.baseUrl}/customer`;

  constructor() { }

  findAll() {

  }

  updateOne() { }

  deleteOne() { }

  create() { }

}
