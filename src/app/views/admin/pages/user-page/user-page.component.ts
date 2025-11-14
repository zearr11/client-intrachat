import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PaginatedResponse } from '../../../../shared/interfaces/paginated-response.interface';
import { UserService } from '../../../../entity/user/services/user.service';
import { UserResponse } from '../../../../entity/user/interfaces/user.interface';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { SearchInputDarkComponent } from "../../common/search-input-dark/search-input-dark.component";
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { ActivesInactivesSelectDarkComponent } from "../../common/actives-inactives-select-dark/actives-inactives-select-dark.component";
import { NavTableDarkComponent } from "../../common/nav-table-dark/nav-table-dark.component";

@Component({
  selector: 'user-page',
  imports: [
    SearchInputDarkComponent,
    ActivesInactivesSelectDarkComponent,
    TitleCasePipe,
    DatePipe,
    NavTableDarkComponent
],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent {

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

}
