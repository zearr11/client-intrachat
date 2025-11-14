import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { PaginatedResponse } from '../../../../shared/interfaces/paginated-response.interface';
import { UserService } from '../../../../entity/user/services/user.service';
import { UserResponse } from '../../../../entity/user/interfaces/user.interface';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { SearchInputDarkComponent } from "../../common/search-input-dark/search-input-dark.component";
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { ActivesInactivesSelectDarkComponent } from "../../common/actives-inactives-select-dark/actives-inactives-select-dark.component";
import { NavTableDarkComponent } from "../../common/nav-table-dark/nav-table-dark.component";
import { ToastMessageService } from '../../../../shared/services/toast-message.service';
import { ModalPersonalizedComponent } from '../../../../shared/components/modal-personalized/modal-personalized.component';
import { modalType, entity } from '../../../../shared/types/modal.types';

@Component({
  selector: 'user-page',
  imports: [
    SearchInputDarkComponent,
    ActivesInactivesSelectDarkComponent,
    TitleCasePipe,
    DatePipe,
    NavTableDarkComponent,
    ModalPersonalizedComponent
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent {

  private toastService = inject(ToastMessageService);

  usersElementsTable: string[] = [
    'N°', 'Usuario', 'Tipo', 'Identificación',
    'Email', 'Celular', 'Creación', 'Modificación', ''
  ]

  userService = inject(UserService);
  dataPaginated = signal<PaginatedResponse<UserResponse> | null>(null);

  nothingShowInTable = computed<boolean>(() =>
    this.dataPaginated()?.totalPages == 0
    || this.dataPaginated()?.totalPages == this.dataPaginated()?.page
  );

  // private idUserManagement = signal<number | null>(null);

  // parametros de consulta http
  showActives = signal<boolean>(true);
  pageCurrent = signal<number | null>(null);
  filter = signal<string>('');

  // Peticion http paginada
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
        tap(resp => this.dataPaginated.set(resp))
      );
    }
  }));

  // Al cambiar de estado en el dropdown
  changeState(number: string) {
    if (number == '1')
      this.showActives.set(true);
    else
      this.showActives.set(false);

    this.pageCurrent.set(null);
    this.filter.set('');
  }

  // Siguiente pagina al presionar un elememento page
  nextPage(page: number) {
    this.pageCurrent.set(page);
  }

  // Al avanzar o retroceder en el paginado
  changePage(isNext: boolean) {
    if (isNext) {
      this.nextPage((this.pageCurrent()! + 1))
      return;
    }
    this.nextPage((this.pageCurrent()! - 1))
  }

  // Al buscar por filtro y dar click en buscar o enter
  setFilterPaginated(txtFilter: string) {
    this.filter.set(txtFilter)
    this.pageCurrent.set(null);
  }

  // Boton Limipiar filtros
  clearFilters() {
    this.filter.set('');
    this.pageCurrent.set(null);
  }

  // ------------------------- MODAL -------------------------

  @ViewChild('modalRef') modalRef!: ModalPersonalizedComponent;

  idUserManagement = signal<number | null>(null);
  titleModal = signal<string>('');
  typeModal = signal<modalType | null>(null);

  messageModal = signal<string>('');
  entityToAction = signal<string>('');
  messageSecondary = signal<string>('');

  openModal(id: number, modalTitle: string, type: modalType, fullName?: string) {
    // Establecimiento de parametros
    this.idUserManagement.set(id);
    this.titleModal.set(modalTitle);
    this.typeModal.set(type);

    if (['delete', 'restore'].includes(type)) {
      this.entityToAction.set(`${fullName} ?`);
      const msg = type == 'delete'
        ? '¿Estás seguro de querer deshabilitar la cuenta del usuario '
        : '¿Estás seguro de querer habilitar la cuenta del usuario ';
      const textSecondary = type == 'delete'
        ? 'Nota: El usuario dejará de tener acceso a la plataforma.'
        : 'Nota: El usuario podrá acceder nuevamente a la plataforma.'

      this.messageModal.set(msg);
      this.messageSecondary.set(textSecondary);
    }

    // Mostrar modal
    this.modalRef.show();
  }

  realizedActionModal(isActive: boolean) {
    if (!isActive) {
      this.idUserManagement.set(null);
      return;
    }

    if (this.typeModal() == 'delete' || this.typeModal() == 'restore') {
      const newState = this.typeModal() == 'delete' ? false : true;
      this.userService.updateDataUser(
        this.idUserManagement()!, { estado: newState }
      ).pipe(
        tap(() => {
          const msg = !newState
            ? 'Usuario deshabilitado satisfactoriamente.'
            : 'Usuario habilitado satisfactoriamente.';
          const color = !newState ? 'text-bg-danger' : 'text-bg-primary';

          this.toastService.show(msg, color);
          this.httpUsersPaginated.reload()
        })
      ).subscribe();
    }
  }

  // ---------------------------------------------------------

  /*
  showModalDelete(id: number) {
    this.idUserManagement.set(id);
    this.modalService.show({
      titleModal: 'Deshabilitar usuario',
      typeEntity: 'user',
      typeModal: 'delete'
    });
  }

  httpDeleteUser = rxResource(({
    request: () => ({
      id: this.idUserManagement(),
      isConfirm: this.modalService.stateDeleteElement()
    }),
    loader: ({ request }) => {

      if (!request.id || !request.isConfirm) return of(false);

      console.log(`id: ${request.id}`);
      console.log(`Eliminar usuario: ${request.isConfirm}`);

      return this.userService.updateDataUser(request.id,
        {
          estado: false
        }).pipe(
          tap(resp => {
            this.toastService.show(
              resp, 'text-bg-primary'
            )
            this.idUserManagement.set(null);
            this.modalService.changeStatetDeleteElement();
            this.httpUsersPaginated.reload();
          }),
          map(() => true)
        )
    }
  }));
  */
}
