import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, CheckTokenResponse, User } from '../interfaces/auth.interface';
import { environment } from '../../../environments/environment.development';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = `${environment.baseUrl}/auth`;
  private _user!: User;

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
        tap(({user, token}) => this.saveToken(user, token)),
        catchError(err => throwError(() => err.error.message))
      );
  }

  tokenValidation(): Observable<boolean> {

    const url: string = `${ this.baseUrl }/check-token`;
    const token = localStorage.getItem('token');
    if(!token) {
      this.logout();
      return of(false);
    }
    const headers = new HttpHeaders()
      .set('Authorization', `Beared ${token}`);
    return this.http.get<CheckTokenResponse>(url, { headers })
      .pipe(
        map(({user, token}) => this.saveToken(user, token)),
        catchError( () => of(false))
      );
  }

  logout() {
    localStorage.removeItem('token');
    // set _user to null or {}?
  }

  get user() {
    return { ...this._user };
  }
}
