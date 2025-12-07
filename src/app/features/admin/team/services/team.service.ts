import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OptionsPaginated } from '../../../../shared/interfaces/options-paginated.interface';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ResponseGeneric } from '../../../../shared/interfaces/general-response.interface';
import { PaginatedResponse } from '../../../../shared/interfaces/paginated-response.interface';
import {
  TeamRequest,
  TeamRequest2,
  TeamResponse,
  TeamSpecialResponse,
} from '../interfaces/team.interface';
import { environment } from '../../../../../environments/environment';

const baseUrl = `${environment.baseUrl}/equipos`;

@Injectable({ providedIn: 'root' })
export class TeamService {
  private http = inject(HttpClient);

  getTeamById = (idTeam: number) => {
    return this.http
      .get<ResponseGeneric<TeamResponse>>(`${baseUrl}/${idTeam}`)
      .pipe(map((resp) => resp.data));
  };

  getTeamPaginated = (
    options?: OptionsPaginated
  ): Observable<ResponseGeneric<PaginatedResponse<TeamSpecialResponse>>> => {
    const params = new HttpParams({ fromObject: options as any });

    return this.http.get<
      ResponseGeneric<PaginatedResponse<TeamSpecialResponse>>
    >(`${baseUrl}/paginacion`, { params });
  };

  registerNewTeam = (dataTeam: TeamRequest): Observable<string> => {
    return this.http.post<ResponseGeneric<null>>(baseUrl, dataTeam).pipe(
      map((resp) => resp.message!),
      catchError((err: HttpErrorResponse) => {
        const messageError =
          err.error?.message ?? 'Error inesperado, inténtelo mas tarde.';
        return throwError(() => new Error(messageError));
      })
    );
  };

  updateTeam = (idTeam: number, dataTeam: TeamRequest2): Observable<string> => {
    return this.http
      .put<ResponseGeneric<null>>(`${baseUrl}/${idTeam}`, dataTeam)
      .pipe(
        map((resp) => resp.message!),
        catchError((err: HttpErrorResponse) => {
          const messageError =
            err.error?.message ?? 'Error inesperado, inténtelo mas tarde.';
          return throwError(() => new Error(messageError));
        })
      );
  };

  dissableTeam = (idTeam: number): Observable<string> => {
    return this.http
      .delete<ResponseGeneric<null>>(`${baseUrl}/${idTeam}`)
      .pipe(map((resp) => resp.message!));
  };
}
