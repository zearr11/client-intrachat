import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OptionsPaginated } from '../../../shared/interfaces/options-paginated.interface';
import { Observable } from 'rxjs';
import { ResponseGeneric } from '../../../shared/interfaces/general-response.interface';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response.interface';
import { HeadquartersResponse } from '../interfaces/headquarters.interface';
import { environment } from '../../../../environments/environment';

const baseUrl = `${environment.baseUrl}/sedes`;

@Injectable({ providedIn: 'root' })
export class HeadquartersService {
  private http = inject(HttpClient);

  getHeadquartersPaginated = (
    options?: OptionsPaginated
  ): Observable<ResponseGeneric<PaginatedResponse<HeadquartersResponse>>> => {
    const params = new HttpParams({ fromObject: options as any });

    return this.http.get<
      ResponseGeneric<PaginatedResponse<HeadquartersResponse>>
    >(`${baseUrl}/paginacion`, { params });
  };
}
