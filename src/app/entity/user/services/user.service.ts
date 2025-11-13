import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserResponse } from '../interfaces/user.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { ResponseGeneric } from '../../../shared/interfaces/general-response.interface';
import { RoleMapper } from '../mapper/role.mapper';
import { Role } from '../interfaces/role-user.interface';
import { UserMapper } from '../mapper/user.mapper';

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class UserService {

  private _userData = signal<UserResponse | null>(null);
  private http = inject(HttpClient);

  dataUser = computed(() => this._userData());

  isAdmin = computed(() => {
    const roleUser = RoleMapper.rolToRolUser(this.dataUser()?.rol ?? '');
    return roleUser === Role.ROLE_ADMIN;
  });

  isSupervisorTI = computed(() => {
    const roleUser = RoleMapper.rolToRolUser(this.dataUser()?.rol ?? '');
    return roleUser === Role.ROLE_SUPERVISOR_TI;
  });

  getNameAccount = computed(() => UserMapper.userToFirstNameAndLastname(
    this.dataUser()!.nombres, this.dataUser()!.apellidos
  ));

  loadDataCurrentUser() : Observable<boolean> {
    const url = `${baseUrl}/usuarios/actual`;
    return this.http.get<ResponseGeneric>(url).pipe(
      map(resp => {
        this._userData.set(resp.data as UserResponse)
        return true;
      }),
      catchError(resp => of(false))
    );
  }

}
