import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ResponseGeneric } from '../../../shared/interfaces/general-response.interface';
import { CampaignRequest, CampaignRequest2, CampaignResponse } from '../interfaces/campaign.interface';
import { OptionsPaginated } from '../../../shared/interfaces/options-paginated.interface';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response.interface';
import { catchError, map, of } from 'rxjs';

const baseUrl = `${environment.baseUrl}/campanias`;

@Injectable({ providedIn: 'root' })
export class CampaignService {

  private http = inject(HttpClient);

  getCampaignById = (id: number) => {
    return this.http.get<ResponseGeneric<CampaignResponse>>(`${baseUrl}/${id}`);
  }

  getCampaignByIdCompany = (idCompany: number) => {
    return this.http.get<ResponseGeneric<CampaignResponse[]>>
      (`${baseUrl}/empresas/${idCompany}`);
  }

  getCampaignsPaginated = (options?: OptionsPaginated) => {
    const params = new HttpParams(
      { fromObject: options as any }
    );

    return this.http.get<ResponseGeneric<PaginatedResponse<CampaignResponse>>>(
      `${baseUrl}/paginacion`,
      { params }
    );
  }

  registerCampaign = (newCampaign: CampaignRequest) => {
    return this.http.post<ResponseGeneric<null>>(baseUrl, newCampaign).pipe(
      map(resp => resp.message!),
      catchError((err: HttpErrorResponse) => {
        const messageError = err.error?.message
          ?? 'Error inesperado, inténtelo mas tarde.';
        return of(messageError);
      })
    )
  }

  updateCampaign = (id: number, compaignToUpdate: CampaignRequest2) => {
    return this.http.put<ResponseGeneric<null>>(`${baseUrl}/${id}`, compaignToUpdate).pipe(
      map(resp => resp.message!),
      catchError((err: HttpErrorResponse) => {
        const messageError = err.error?.message
          ?? 'Error inesperado, inténtelo mas tarde.';
        return of(messageError);
      })
    )
  }

}
