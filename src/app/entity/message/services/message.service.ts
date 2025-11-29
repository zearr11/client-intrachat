import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { OptionsPaginatedMessage } from '../../../shared/interfaces/options-paginated.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { ResponseGeneric } from '../../../shared/interfaces/general-response.interface';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response.interface';
import { MessageResponse } from '../interfaces/message.interface';

const baseUrl = `${environment.baseUrl}/mensajes`;

@Injectable({ providedIn: 'root' })
export class MessageService {
  private http = inject(HttpClient);

  getMessagesRoom(
  idRoom: number,
  options: OptionsPaginatedMessage
): Observable<PaginatedResponse<MessageResponse>> {

  const params = new HttpParams({ fromObject: options as any });

  return this.http
    .get<ResponseGeneric<PaginatedResponse<MessageResponse>>>(
      `${baseUrl}/${idRoom}`,
      { params }
    )
    .pipe(
      map(resp => resp.data as PaginatedResponse<MessageResponse>),
      catchError(err => {
        if (err.status === 404) {
          return of({
            page: options.page ?? 1,
            size: options.size ?? 10,
            itemsOnPage: 0,
            count: 0,
            totalPages: 0,
            result: []
          } as PaginatedResponse<MessageResponse>);
        }

        return throwError(() => err);
      })
    );
}


}
