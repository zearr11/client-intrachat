import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RoomResponse } from '../interfaces/room.interface';
import { ResponseGeneric } from '../../../shared/interfaces/general-response.interface';
import { catchError, map, of, throwError } from 'rxjs';

const baseUrl = `${environment.baseUrl}/salas`;

@Injectable({ providedIn: 'root' })
export class RoomService {
  private http = inject(HttpClient);

  getRoomById(idRoom: number) {
    return this.http
      .get<ResponseGeneric<RoomResponse>>(`${baseUrl}/${idRoom}`)
      .pipe(
        map((resp) => resp.data),
        catchError((error) => {
          if (error.status === 404) {
            return of(null);
          }
          return throwError(() => error);
        })
      );
  }

  getRoomsUserAuthenticated() {
    return this.http
      .get<ResponseGeneric<RoomResponse[]>>(`${baseUrl}/usuario-actual`)
      .pipe(map((resp) => resp.data));
  }

  getRoomByMembers(idUserQuery: number) {
    return this.http
      .get<ResponseGeneric<RoomResponse>>(
        `${baseUrl}/integrantes/${idUserQuery}`
      )
      .pipe(
        map((resp) => resp.data),
        catchError((error) => {
          if (error.status === 404) {
            return of(null);
          }
          return throwError(() => error);
        })
      );
  }
}
