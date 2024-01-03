import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, User } from '../interfaces/auth.interface';
import { environment } from '../../../environments/environment.development';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _user!: User;
  private headers = new HttpHeaders()
    .set('token', localStorage.getItem('token') || '');

  constructor(private http: HttpClient) { }

  saveToken(response: AuthResponse<User>): void {}

  login(email: string, password: string): Observable<AuthResponse<User>> {
    const url: string = `${ this.baseUrl }/login`;
    const body = { email, password };
    return this.http.post<AuthResponse<User>>(url, body)
      .pipe(
        tap(res => this.saveToken(res))
      );
  }

  tokenValidation() {}

  logout() {}

  get user() {
    return { ...this._user };
  }
}
