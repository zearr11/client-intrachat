import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Info, ResponseGeneric } from '../interfaces/auth-response.interface';
import { HttpClient } from '@angular/common/http';

type AuthStatus = 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _message = signal<string | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));
  private _authStatus = signal<AuthStatus>(this._token() ? 'authenticated' : 'not-authenticated');
  private _roleUser = signal('');

  private http = inject(HttpClient);

  accessToken = computed(() => this._token());
  roleUser = computed(() => this._roleUser());

  authStatus = computed<AuthStatus>(() => {
    if (this._token())
      return 'authenticated';

    return 'not-authenticated';
  });

  messageError = computed<string|null>(() => this._message());

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<ResponseGeneric>(`${baseUrl}/auth`, {
        email: email,
        password: password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  logout(message: string) {
    this._message.set(message);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    this._roleUser.set('');

    localStorage.removeItem('token');
  }

  private handleAuthSuccess({ data }: ResponseGeneric) {

    const token = data as Info;

    this._message.set(null);
    this._authStatus.set('authenticated');
    this._token.set(token.accessToken);
    this._roleUser.set(data!.rol);

    localStorage.setItem('token', token.accessToken);

    return true;
  }

  private handleAuthError(error: any) {
    const errorBody = error.error as ResponseGeneric;
    this.logout(errorBody.message!);
    return of(false);
  }

}
