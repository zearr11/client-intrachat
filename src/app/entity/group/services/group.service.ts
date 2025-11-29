import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { ResponseGeneric } from '../../../shared/interfaces/general-response.interface';
import { GroupResponse } from '../interfaces/group.interface';

const baseUrl = `${environment.baseUrl}/grupos`;

@Injectable({ providedIn: 'root' })
export class GroupService {
  private http = inject(HttpClient);

  getGroupByRoom(idRoom: number): Observable<GroupResponse | null> {
    return this.http
      .get<ResponseGeneric<GroupResponse>>(`${baseUrl}/salas/${idRoom}`)
      .pipe(
        map((resp) => resp.data!),
        catchError((err) => {
          if (err.status === 404) {
            return of(null);
          }
          return throwError(() => err);
        })
      );
  }
}
