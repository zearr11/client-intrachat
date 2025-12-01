import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResponseGeneric } from '../../../shared/interfaces/general-response.interface';
import { ContactResponse } from '../interfaces/contact.interface';
import { map } from 'rxjs';

const baseUrl = `${environment.baseUrl}/contactos`;

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);

  getContactsRecently(filtroBusqueda?: string) {
    const params = new HttpParams().set('filtroBusqueda', filtroBusqueda ?? '');

    return this.http
      .get<ResponseGeneric<ContactResponse[]>>(`${baseUrl}/recientes`, {
        params,
      })
      .pipe(map((resp) => resp.data));
  }

  getContactsGroups(filtroBusqueda?: string) {
    const params = new HttpParams().set('filtroBusqueda', filtroBusqueda ?? '');

    return this.http
      .get<ResponseGeneric<ContactResponse[]>>(`${baseUrl}/grupos`, {
        params,
      })
      .pipe(map((resp) => resp.data));
  }

  getContactsCampania(filtroBusqueda?: string) {
    const params = new HttpParams().set('filtroBusqueda', filtroBusqueda ?? '');

    return this.http
      .get<ResponseGeneric<ContactResponse[]>>(`${baseUrl}/campania`, {
        params,
      })
      .pipe(map((resp) => resp.data));
  }
}
