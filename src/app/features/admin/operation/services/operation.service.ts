import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { ResponseGeneric } from '../../../../shared/interfaces/general-response.interface';
import { PaginatedResponse } from '../../../../shared/interfaces/paginated-response.interface';
import { OptionsPaginatedOperation } from '../../../../shared/interfaces/options-paginated.interface';
import {
  OperationRequest,
  OperationResponse,
  OperationSpecialResponse,
} from '../interfaces/operation.interface';
import { HttpClient, HttpParams } from '@angular/common/http';

const baseUrl = `${environment.baseUrl}/operaciones`;

@Injectable({ providedIn: 'root' })
export class OperationService {
  private http = inject(HttpClient);

  getOperationById = (idOperation: number): Observable<OperationResponse> => {
    return this.http
      .get<ResponseGeneric<OperationResponse>>(`${baseUrl}/${idOperation}`)
      .pipe(map((resp) => resp.data!));
  };

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

  registerOperation = (dataOperation: OperationRequest): Observable<string> => {
    return this.http
      .post<ResponseGeneric<null>>(baseUrl, dataOperation)
      .pipe(map((resp) => resp.message!));
  };

  updateOperation = (
    idOperation: number,
    dataOperation: OperationRequest
  ): Observable<string> => {
    return this.http
      .put<ResponseGeneric<null>>(`${baseUrl}/${idOperation}`, dataOperation)
      .pipe(map((resp) => resp.message!));
  };

  deleteOperation = (idOperation: number): Observable<string> => {
    return this.http
      .delete<ResponseGeneric<null>>(`${baseUrl}/${idOperation}`)
      .pipe(map((resp) => resp.message!));
  };
}
