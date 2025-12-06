import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ResponseGeneric } from '../../../../shared/interfaces/general-response.interface';
import { PaginatedResponse } from '../../../../shared/interfaces/paginated-response.interface';
import { OptionsPaginatedOperation } from '../../../../shared/interfaces/options-paginated.interface';
import { OperationSpecialResponse } from '../interfaces/operation.interface';
import { HttpClient, HttpParams } from '@angular/common/http';

const baseUrl = `${environment.baseUrl}/operaciones`;

@Injectable({ providedIn: 'root' })
export class OperationService {
  private http = inject(HttpClient);

  getOperationPaginated = (
    options?: OptionsPaginatedOperation
  ): Observable<
    ResponseGeneric<PaginatedResponse<OperationSpecialResponse>>
  > => {
    const params = new HttpParams({ fromObject: options as any });

    return this.http.get<
      ResponseGeneric<PaginatedResponse<OperationSpecialResponse>>
    >(`${baseUrl}/paginacion`, { params });
  };
}
