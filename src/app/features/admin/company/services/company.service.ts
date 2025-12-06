import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ResponseGeneric } from '../../../../shared/interfaces/general-response.interface';
import {
  CompanyRequest,
  CompanyRequest2,
  CompanyResponse,
} from '../interfaces/company.interface';
import { OptionsPaginated } from '../../../../shared/interfaces/options-paginated.interface';
import { PaginatedResponse } from '../../../../shared/interfaces/paginated-response.interface';

const baseUrl = `${environment.baseUrl}/empresas`;

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private http = inject(HttpClient);

  getCompanyById = (
    id: number
  ): Observable<ResponseGeneric<CompanyResponse>> => {
    return this.http.get<ResponseGeneric<CompanyResponse>>(`${baseUrl}/${id}`);
  };

  getAllCompanys = (): Observable<ResponseGeneric<CompanyResponse[]>> => {
    return this.http.get<ResponseGeneric<CompanyResponse[]>>(baseUrl);
  };

  getCompanysPaginated = (
    options?: OptionsPaginated
  ): Observable<ResponseGeneric<PaginatedResponse<CompanyResponse>>> => {
    const params = new HttpParams({ fromObject: options as any });

    return this.http.get<ResponseGeneric<PaginatedResponse<CompanyResponse>>>(
      `${baseUrl}/paginacion`,
      { params }
    );
  };

  registerNewCompany = (newCompany: CompanyRequest): Observable<string> => {
    return this.http.post<ResponseGeneric<null>>(baseUrl, newCompany).pipe(
      map((resp) => resp.message!),
      catchError((err: HttpErrorResponse) => {
        const messageError =
          err.error?.message ?? 'Error inesperado, inténtelo más tarde.';

        return throwError(() => new Error(messageError));
      })
    );
  };

  updateCompany = (
    id: number,
    companyToUpdate: CompanyRequest2
  ): Observable<string> => {
    return this.http
      .put<ResponseGeneric<null>>(`${baseUrl}/${id}`, companyToUpdate)
      .pipe(
        map((resp) => resp.message!),
        catchError((err: HttpErrorResponse) => {
          const messageError =
            err.error?.message ?? 'Error inesperado, inténtelo mas tarde.';

          return throwError(() => new Error(messageError));
        })
      );
  };
}
