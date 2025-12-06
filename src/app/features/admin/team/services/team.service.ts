import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OptionsPaginated } from '../../../../shared/interfaces/options-paginated.interface';
import { Observable } from 'rxjs';
import { ResponseGeneric } from '../../../../shared/interfaces/general-response.interface';
import { PaginatedResponse } from '../../../../shared/interfaces/paginated-response.interface';
import { TeamSpecialResponse } from '../interfaces/team.interface';
import { environment } from '../../../../../environments/environment';

const baseUrl = `${environment.baseUrl}/equipos`;

@Injectable({ providedIn: 'root' })
export class TeamService {
  private http = inject(HttpClient);

  getTeamPaginated = (
    options?: OptionsPaginated
  ): Observable<ResponseGeneric<PaginatedResponse<TeamSpecialResponse>>> => {
    const params = new HttpParams({ fromObject: options as any });

    return this.http.get<
      ResponseGeneric<PaginatedResponse<TeamSpecialResponse>>
    >(`${baseUrl}/paginacion`, { params });
  };
}
