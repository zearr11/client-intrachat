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

  getContactsCampania(filtroBusqueda?: string) {
    const params = new HttpParams().set('filtroBusqueda', filtroBusqueda ?? '');

    return this.http.get<ResponseGeneric<ContactResponse[]>>(
      `${baseUrl}/todos`,
      {
        params,
      }
    ).pipe(
      map(resp => resp.data)
    );
  }

  getContactsRecently() {
    return this.http.get<ResponseGeneric<ContactResponse[]>>(
      `${baseUrl}/recientes`
    ).pipe(
      map(resp => resp.data)
    );
  }
}
