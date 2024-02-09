import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { CheckTokenResponse, User } from '../interfaces/auth.interface';
import { environment } from '../../../environments/environment.development';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { AuthStatus } from '../interfaces/auth-status.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = `${environment.baseUrl}/auth`;
  private _user!: User;
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public authStatus = computed(() => this._authStatus());

  constructor(private http: HttpClient) { 
    this.tokenValidation().subscribe();
  }

  saveToken(user: User, token: string): boolean {
    
    this._user = user;
    this._authStatus.set(AuthStatus.authenticated);
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
      console.log('ENTRA EN IF');
      this.logout();
      return of(false);
    }
    const headers = new HttpHeaders()
      .set('authorization', `Beared ${token}`);
    return this.http.get<CheckTokenResponse>(url, { headers })
      .pipe(
        map(({user, token}) => this.saveToken(user, token)),
        catchError( () => {
          this._authStatus.set(AuthStatus.notAuthenticated);
          return of(false);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this._authStatus.set(AuthStatus.notAuthenticated);
    // set _user to null or {}?
  }

  get user() {
    return { ...this._user };
  }
}
