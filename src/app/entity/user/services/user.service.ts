import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserResponse } from '../interfaces/user.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { ResponseGeneric } from '../../../shared/interfaces/general-response.interface';
import { RoleMapper } from '../mapper/role.mapper';
import { UserMapper } from '../mapper/user.mapper';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response.interface';
import { RoleComplete } from '../enums/role-complete.enum';

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class UserService {

  private _userData = signal<UserResponse | null>(null);
  private http = inject(HttpClient);

  dataUser = computed(() => this._userData());

  isAdmin = computed(() => {
    const userData = this.dataUser()?.rol;

    if (userData) {
      const roleUser = RoleMapper.rolToRolUser(this.dataUser()!.rol);
      return roleUser === RoleComplete.ROLE_ADMIN;
    }

    return false;
  });

  isSupervisorTI = computed(() => {
    const userData = this.dataUser()?.rol;

    if (userData) {
      const roleUser = RoleMapper.rolToRolUser(this.dataUser()!.rol);
      return roleUser === RoleComplete.ROLE_SUPERVISOR_TI;
    }

    return false;
  });

  getNameAccount = computed(() =>
    UserMapper.userToFirstNameAndLastname(
      this.dataUser()!.nombres, this.dataUser()!.apellidos
    )
  );

  loadDataCurrentUser(): Observable<boolean> {
    const url = `${baseUrl}/usuarios/actual`;
    return this.http.get<ResponseGeneric<UserResponse>>(url).pipe(
      map(resp => {
        this._userData.set(resp.data)
        return true;
      }),
      catchError(resp => of(false))
    );
  }

  getUsersPaginated(
    options?: {
      page?: number, size?: number,
      state?: boolean, filter?: string
    }
  ): Observable<PaginatedResponse<UserResponse>> {

    const url = `${baseUrl}/usuarios/paginacion`;
    let params = new HttpParams();

    if (options?.page) params = params.set('page', options.page);
    if (options?.size) params = params.set('size', options.size);
    if (options?.state != undefined) params = params.set('estado', options.state);
    if (options?.filter) params = params.set('filtro', options.filter);

    // console.log(params);

    return this.http.get<ResponseGeneric<PaginatedResponse<UserResponse>>>
      (url, { params })
      .pipe(
        map(resp => resp.data!)
      );
  }

}
