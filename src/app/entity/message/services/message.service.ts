import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { OptionsPaginatedMessage } from '../../../shared/interfaces/options-paginated.interface';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { ResponseGeneric } from '../../../shared/interfaces/general-response.interface';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response.interface';
import { MessageResponse } from '../interfaces/message.interface';
import { ChatRequest } from '../../chat/interfaces/chat.interface';

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
        map((resp) => resp.data as PaginatedResponse<MessageResponse>),
        catchError((err) => {
          if (err.status === 404) {
            return of({
              page: options.page ?? 1,
              size: options.size ?? 10,
              itemsOnPage: 0,
              count: 0,
              totalPages: 0,
              result: [],
            } as PaginatedResponse<MessageResponse>);
          }
          return throwError(() => err);
        })
      );
  }

  sendMessageFile(archivo: File, chatRequest: ChatRequest) {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append(
      'chatRequest',
      new Blob([JSON.stringify(chatRequest)], { type: 'application/json' })
    );

    return this.http.post<void>(`${baseUrl}`, formData).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(() => new Error(err.error?.message));
      })
    );
  }
}
