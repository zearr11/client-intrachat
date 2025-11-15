import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { PaginatedResponse } from '../../../../shared/interfaces/paginated-response.interface';
import { UserService } from '../../../../entity/user/services/user.service';
import { UserResponse } from '../../../../entity/user/interfaces/user.interface';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { SearchInputDarkComponent } from "../../common/search-input-dark/search-input-dark.component";
import { rxResource } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { ActivesInactivesSelectDarkComponent } from "../../common/actives-inactives-select-dark/actives-inactives-select-dark.component";
import { NavTableDarkComponent } from "../../common/nav-table-dark/nav-table-dark.component";
import { ToastMessageService } from '../../../../shared/services/toast-message.service';
import { UserModalAddComponent } from '../../../../entity/user/modals/user-modal-add/user-modal-add.component';
import { UserModalChangeStateComponent } from '../../../../entity/user/modals/user-modal-change-state/user-modal-change-state.component';
import { UserModalEditComponent } from '../../../../entity/user/modals/user-modal-edit/user-modal-edit.component';
import { UserModalInfoComponent } from '../../../../entity/user/modals/user-modal-info/user-modal-info.component';

@Component({
  selector: 'user-page',
  imports: [
    SearchInputDarkComponent,
    ActivesInactivesSelectDarkComponent,
    TitleCasePipe,
    DatePipe,
    NavTableDarkComponent,
    UserModalAddComponent,
    UserModalEditComponent,
    UserModalChangeStateComponent,
    UserModalInfoComponent
],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent {

  private toastService = inject(ToastMessageService);
  private userService = inject(UserService);

  usersElementsTable: string[] = [
    'N°', 'Usuario', 'Tipo', 'Identificación',
    'Email', 'Celular', 'Creación', 'Modificación', ''
  ];

  // ------------------- HTTP Listado --------------------------

  /* Parametros iniciales listado */
  filter = signal<string>('');
  pageCurrent = signal<number | null>(null);
  showActives = signal<boolean>(true);

  /* Data paginada de usuarios */
  dataPaginated = signal<PaginatedResponse<UserResponse> | null>(null);

  /* Buscar por filtro en la tabla usuario */
  setFilterPaginated(txtFilter: string) {
    this.filter.set(txtFilter)
    this.pageCurrent.set(null);
  }

  /* Limpiar filtros de busqueda */
  clearFilters() {
    this.filter.set('');
    this.pageCurrent.set(null);
  }

  /* Cambiar estados entre activos e inactivos */
  changeState(number: string) {
    if (number == '1')
      this.showActives.set(true);
    else
      this.showActives.set(false);

    this.pageCurrent.set(null);
    this.filter.set('');
  }

  /* Para saber si hay elementos en el paginado */
  nothingShowInTable = computed<boolean>(() =>
    this.dataPaginated()?.totalPages == 0
    || this.dataPaginated()?.totalPages == this.dataPaginated()?.page
  );

  /* Cambiar pagina */
  nextPage(page: number) {
    this.pageCurrent.set(page);
  }

  /* Al avanzar o retroceder con los laterales */
  changePage(isNext: boolean) {
    if (isNext) {
      this.nextPage((this.pageCurrent()! + 1))
      return;
    }
    this.nextPage((this.pageCurrent()! - 1))
  }

  /* Peticion HTTP Paginada y asignacion a un signal */
  httpUsersPaginated = rxResource(({
    request: () => (
      {
        page: this.pageCurrent(),
        state: this.showActives(),
        filter: this.filter()
      }),
    loader: ({ request }) => {
      return this.userService.getUsersPaginated({
        page: request.page ?? undefined,
        state: request.state,
        filter: request.filter
      }).pipe(
        tap(resp => this.dataPaginated.set(resp)),
        map(resp => {
          if (!resp.count)
            this.toastService.show(
              'No se encontraron resultados.', 'text-bg-danger'
            )
        })
      );
    }
  }));

  // ------------------- Modales --------------------------------

  /* Declaracion de modales */
  @ViewChild('modalInfoUser') modalInfoUser!: UserModalInfoComponent;
  @ViewChild('modalNewUser') modalNewUser!: UserModalAddComponent;
  @ViewChild('modalEditUser') modalEditUser!: UserModalEditComponent;
  @ViewChild('modalChangeStateUser') modalChangeStateUser!: UserModalChangeStateComponent;

  /* Atributos de Info User */
  dataInfoUser = signal<UserResponse | null>(null);

  /* Atributos de Change State */
  idUserToChangeState = signal<number | null>(null);
  isDelete = signal<boolean>(false);

  /* Atributos de Edit User */
  dataUserEdit = signal<UserResponse | null>(null);

  /* Apertura de modal info usuario */
  openModalInfoUser(user: UserResponse) {
    this.dataInfoUser.set(user);
    this.modalInfoUser.show();
  }

  /* Apertura de modal nuevo usario */
  openModalNewUser() {
    this.modalNewUser.show();
  }

  /* Apertura de modal modificar usario */
  openModalEditUser(user: UserResponse) {
    this.dataUserEdit.set(user);
    this.modalEditUser.show();
  }

  /* Apertura de modal cambiar estado de usario */
  openModalChangeState(id: number, isDelete: boolean) {
    this.idUserToChangeState.set(id);
    this.isDelete.set(isDelete);
    this.modalChangeStateUser.show();
  }

  reloadTable(reload: boolean) {
    if (!reload) return;
    this.httpUsersPaginated.reload();
  }

}
