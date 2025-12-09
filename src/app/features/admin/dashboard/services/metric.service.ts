import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ResponseGeneric } from '../../../../shared/interfaces/general-response.interface';
import {
  AlertResponse,
  InfoDailyResponse,
  InfoGeneralResponse,
  MessagesAveragePerMonthResponse,
  NewUsersPerMonthResponse,
} from '../interfaces/metric.interface';
import { map, Observable } from 'rxjs';

const baseUrl = `${environment.baseUrl}/metricas`;

@Injectable({ providedIn: 'root' })
export class MetricService {
  private http = inject(HttpClient);

  getAlertsUsers = (): Observable<AlertResponse> => {
    return this.http
      .get<ResponseGeneric<AlertResponse>>(`${baseUrl}/alertas`)
      .pipe(map((resp) => resp.data!));
  };

  getInfoGeneral = (): Observable<InfoGeneralResponse> => {
    return this.http
      .get<ResponseGeneric<InfoGeneralResponse>>(`${baseUrl}/general`)
      .pipe(map((resp) => resp.data!));
  };

  getInfoDaily = (): Observable<InfoDailyResponse> => {
    return this.http
      .get<ResponseGeneric<InfoDailyResponse>>(`${baseUrl}/diarias`)
      .pipe(map((resp) => resp.data!));
  };

  getUserNewsInAnio = (anio: number): Observable<NewUsersPerMonthResponse[]> => {
    return this.http
      .get<ResponseGeneric<NewUsersPerMonthResponse[]>>(
        `${baseUrl}/usuarios/alta-anual`,
        { params: { anio } }
      )
      .pipe(map((resp) => resp.data!));
  };

  getMessagesAverageInAnio = (
    anio: number
  ): Observable<MessagesAveragePerMonthResponse[]> => {
    return this.http
      .get<ResponseGeneric<MessagesAveragePerMonthResponse[]>>(
        `${baseUrl}/mensajes/promedio`,
        { params: { anio } }
      )
      .pipe(map((resp) => resp.data!));
  };
}
