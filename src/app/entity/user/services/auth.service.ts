import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Role } from '../interfaces/role-user.interface';
import { ResponseGeneric } from '../../../shared/interfaces/general-response.interface';
import { InfoAcces } from '../interfaces/info-access.interface';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private _message = signal<string | null>(null);
  private _isMessageError = signal<boolean>(false);
  private _token = signal<string | null>(localStorage.getItem('token'));

  accessToken = computed(() => this._token());

  message = computed<string|null>(() => this._message());
  isMessageError = computed<boolean>(() => this._isMessageError());

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

  logout(message: string, isError: boolean) {
    this._message.set(message);
    this._isMessageError.set(isError);

    this._token.set(null);
    localStorage.removeItem('token');
  }

  private handleAuthSuccess({ data }: ResponseGeneric) {

    const token = data as InfoAcces;

    this._message.set(null);
    this._token.set(token.accessToken);
    localStorage.setItem('token', token.accessToken);

    return true;
  }

  private handleAuthError(error: any) {
    const errorBody = error.error as ResponseGeneric;
    this.logout(errorBody.message!, true);
    return of(false);
  }

}
