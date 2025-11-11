import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';
import { UserResponse } from '../interfaces/user.interface';
import { map } from 'rxjs';
import { ResponseGeneric } from '../../auth/interfaces/auth-response.interface';

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class UserService {

  private _dataReady = signal<boolean>(false);
  private _userData = signal<UserResponse | null>(null);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  isLoad = computed(() => this._dataReady());
  dataUser = computed(() => this._userData());

  loadDataCurrentUser() : void {
    const url = `${baseUrl}/usuarios/actual`;
    this.http.get<ResponseGeneric>(url, {
      headers: {
        Authorization: `Bearer ${this.authService.accessToken()}`
      }
    }).pipe(
      map(resp => {
        console.log(resp);
        this._userData.set(resp.data as UserResponse)
        this._dataReady.set(true)
      })
    ).subscribe();
  }

}
