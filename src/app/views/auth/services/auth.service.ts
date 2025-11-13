import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ResponseGeneric } from '../../../shared/interfaces/general-response.interface';
import { InfoAcces } from '../../../entity/user/interfaces/info-access.interface';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private _message = signal<string | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  accessToken = computed(() => this._token());
  message = computed<string|null>(() => this._message());

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

  logout(message: string | null = null) {
    this._message.set(message);
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
    this.logout(errorBody.message!);
    return of(false);
  }

}
