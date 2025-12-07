import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  UserRequest,
  UserRequest2,
  UserResponse,
} from '../interfaces/user.interface';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Role } from '../enums/role-user.enum';
import { UserMapper } from '../mapping/user.mapper';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { ResponseGeneric } from '../../shared/interfaces/general-response.interface';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response.interface';
import { Position } from '../enums/position-user.enum';
import { OptionsPaginatedUserTeam } from '../../features/admin/team/components/team-edit/team-edit.component';

const baseUrlUser = `${environment.baseUrl}/usuarios`;

@Injectable({ providedIn: 'root' })
export class UserService {
  private _userData = signal<UserResponse | null>(null);
  private http = inject(HttpClient);

  dataUser = computed(() => this._userData());

  isAdmin = computed(() => {
    const userData = this.dataUser()?.rol;

    if (userData) {
      return userData === Role.ADMIN;
    }

    return false;
  });

  getNameAccount = computed(() => {
    if (this._userData()) {
      return UserMapper.userToFirstNameAndLastname(
        this._userData()!.nombres,
        this.dataUser()!.apellidos
      );
    }
    return 'de nuevo.';
  });

  // Usuario Actual
  loadDataCurrentUser(): Observable<boolean> {
    const url = `${baseUrlUser}/actual`;
    return this.http.get<ResponseGeneric<UserResponse>>(url).pipe(
      map((resp) => {
        this._userData.set(resp.data);
        return true;
      }),
      catchError((resp) => of(false))
    );
  }

  // Usuario por id
  getUserById(id: number): Observable<UserResponse> {
    const url = `${baseUrlUser}/${id}`;

    return this.http.get<ResponseGeneric<UserResponse>>(url).pipe(
      map((resp) => resp.data!),
      catchError((err: HttpErrorResponse) => {
        const messageError =
          err.error?.message ?? 'Error inesperado, inténtelo mas tarde.';
        return throwError(() => new Error(messageError));
      })
    );
  }

  // Paginacion
  getUsersWithTeamAndWithoutCampaignPaginated(
    options?: OptionsPaginatedUserTeam
  ): Observable<PaginatedResponse<UserResponse>> {
    const url = `${baseUrlUser}/paginacion/equipos`;
    let params = new HttpParams();

    if (options?.page) params = params.set('page', options.page);
    if (options?.size) params = params.set('size', options.size);
    if (options?.state != undefined)
      params = params.set('estado', options.state);
    if (options?.filter) params = params.set('filtro', options.filter);
    if (options?.cargo) params = params.set('cargo', options.cargo);
    if (options?.idTeam) params = params.set('idEquipo', options.idTeam);

    return this.http
      .get<ResponseGeneric<PaginatedResponse<UserResponse>>>(url, { params })
      .pipe(map((resp) => resp.data!));
  }

  // Paginacion
  getUsersPaginated(options?: {
    page?: number;
    size?: number;
    state?: boolean;
    filter?: string;
    cargo?: Position;
    enCampania?: boolean;
  }): Observable<PaginatedResponse<UserResponse>> {
    const url = `${baseUrlUser}/paginacion`;
    let params = new HttpParams();

    if (options?.page) params = params.set('page', options.page);
    if (options?.size) params = params.set('size', options.size);
    if (options?.state != undefined)
      params = params.set('estado', options.state);
    if (options?.filter) params = params.set('filtro', options.filter);
    if (options?.cargo) params = params.set('cargo', options.cargo);
    if (options?.enCampania != null)
      params = params.set('enCampania', options.enCampania);

    return this.http
      .get<ResponseGeneric<PaginatedResponse<UserResponse>>>(url, { params })
      .pipe(map((resp) => resp.data!));
  }

  registerNewUser(dataUser: UserRequest): Observable<string> {
    return this.http.post<ResponseGeneric<null>>(baseUrlUser, dataUser).pipe(
      map((resp) => resp.message!),
      catchError((err: HttpErrorResponse) => {
        const messageError =
          err.error?.message ?? 'Error inesperado, inténtelo mas tarde.';
        return throwError(() => new Error(messageError));
      })
    );
  }

  updateDataUser(id: number, dataUser: UserRequest2): Observable<string> {
    const url = `${baseUrlUser}/${id}`;
    return this.http.put<ResponseGeneric<null>>(url, dataUser).pipe(
      map((resp) => resp.message!),
      catchError((err: HttpErrorResponse) => {
        const messageError =
          err.error?.message ?? 'Error inesperado, inténtelo mas tarde.';
        return throwError(() => new Error(messageError));
      })
    );
  }

  updatePhotoUser(id: number, file: File | null): Observable<string> {
    const url = `${baseUrlUser}/${id}`;
    const formData = new FormData();

    if (file) formData.append('imagenUsuario', file);

    return this.http.patch<ResponseGeneric<null>>(url, formData).pipe(
      map((resp) => resp.message!),
      catchError((err: HttpErrorResponse) => {
        const messageError =
          err.error?.message ?? 'Error inesperado, inténtelo mas tarde.';
        return throwError(() => new Error(messageError));
      })
    );
  }
}
