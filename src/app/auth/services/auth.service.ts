import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, CheckTokenResponse, User } from '../interfaces/auth.interface';
import { environment } from '../../../environments/environment.development';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = `${environment.baseUrl}/auth`;
  private _user!: User;
  private headers = new HttpHeaders()
    .set('token', localStorage.getItem('token') || '');

  constructor(private http: HttpClient) { }

  saveToken(user: User, token: string): boolean {
    
    this._user = user;
    localStorage.setItem('token', token);
    return true;
  }

  login(email: string, password: string): Observable<CheckTokenResponse> {
    const url: string = `${ this.baseUrl }/login`;
    const body = { email, password };
    return this.http.post<CheckTokenResponse>(url, body)
      .pipe(
        tap(({user, token}) => this.saveToken(user, token))
      );
  }

  tokenValidation(): Observable<boolean> {

    const url: string = `${ this.baseUrl }/check-token`;
    const token = localStorage.getItem('token');
    if(!token) {
      return of(false);
    }
    return this.http.get<CheckTokenResponse>(url)
      .pipe(
        map(({user, token}) => this.saveToken(user, token)),
        catchError( () => of(false))
      );
  }

  logout() {}

  get user() {
    return { ...this._user };
  }
}
