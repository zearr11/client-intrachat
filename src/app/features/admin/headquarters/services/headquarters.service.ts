import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { OptionsPaginated } from '../../../../shared/interfaces/options-paginated.interface';
import { map, Observable } from 'rxjs';
import { ResponseGeneric } from '../../../../shared/interfaces/general-response.interface';
import { PaginatedResponse } from '../../../../shared/interfaces/paginated-response.interface';
import {
  HeadquartersRequest,
  HeadquartersRequest2,
  HeadquartersResponse,
} from '../interfaces/headquarters.interface';

const baseUrl = `${environment.baseUrl}/sedes`;

@Injectable({ providedIn: 'root' })
export class HeadquartersService {
  private http = inject(HttpClient);

  getHeadquartersById(id: number): Observable<HeadquartersResponse> {
    return this.http
      .get<ResponseGeneric<HeadquartersResponse>>(`${baseUrl}/${id}`)
      .pipe(map((resp) => resp.data!));
  }

  getHeadquartersPaginated = (
    options?: OptionsPaginated
  ): Observable<ResponseGeneric<PaginatedResponse<HeadquartersResponse>>> => {
    const params = new HttpParams({ fromObject: options as any });

    return this.http.get<
      ResponseGeneric<PaginatedResponse<HeadquartersResponse>>
    >(`${baseUrl}/paginacion`, { params });
  };

  registerNewHeadquarters(
    dataHeadquarters: HeadquartersRequest
  ): Observable<string> {
    return this.http
      .post<ResponseGeneric<null>>(`${baseUrl}`, dataHeadquarters)
      .pipe(map((resp) => resp.message!));
  }

  updateHeadquarters(
    id: number,
    dataHeadquarters: HeadquartersRequest2
  ): Observable<string> {
    return this.http
      .put<ResponseGeneric<null>>(`${baseUrl}/${id}`, dataHeadquarters)
      .pipe(map((resp) => resp.message!));
  }
}
