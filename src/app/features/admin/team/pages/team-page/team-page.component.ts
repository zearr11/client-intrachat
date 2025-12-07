import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { SearchInputDarkComponent } from '../../../../../shared/common/search-input-dark/search-input-dark.component';
import { ActivesInactivesSelectDarkComponent } from '../../../../../shared/common/actives-inactives-select-dark/actives-inactives-select-dark.component';
import { NavTableDarkComponent } from '../../../../../shared/common/nav-table-dark/nav-table-dark.component';
import { ToastMessageService } from '../../../../../shared/services/toast-message.service';
import { TeamService } from '../../services/team.service';
import { OptionsPaginated } from '../../../../../shared/interfaces/options-paginated.interface';
import { PaginatedResponse } from '../../../../../shared/interfaces/paginated-response.interface';
import { TeamSpecialResponse } from '../../interfaces/team.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TeamInfoComponent } from '../../components/team-info/team-info.component';
import { TeamAddComponent } from '../../components/team-add/team-add.component';
import { TeamEditComponent } from '../../components/team-edit/team-edit.component';
import { TeamDeleteComponent } from '../../components/team-delete/team-delete.component';

@Component({
  selector: 'team-page',
  imports: [
    SearchInputDarkComponent,
    ActivesInactivesSelectDarkComponent,
    NavTableDarkComponent,
    DatePipe,
    TeamEditComponent,
    TeamInfoComponent,
    TeamAddComponent,
    TeamDeleteComponent,
  ],
  templateUrl: './team-page.component.html',
  styleUrl: './team-page.component.css',
})
export class TeamPageComponent {
  private toastService = inject(ToastMessageService);
  private teamService = inject(TeamService);

  elementsTable: string[] = [
    'N°',
    'Campaña',
    'Jefe de Operación',
    'Supervisor',
    'Int. Operativos',
    'Int. Inoperativos',
    'Prom. Mensajes Diarios',
    'Creación',
    'Cierre',
    '',
  ];

  // ------------------- HTTP Listado --------------------------

  optionsPaginated = signal<OptionsPaginated>({ estado: true });

  /* Data paginada */
  dataPaginated = signal<PaginatedResponse<TeamSpecialResponse> | null>(null);

  /* Buscar por filtro en la tabla */
  setFilterPaginated(txtFilter: string) {
    this.optionsPaginated.update((v) => ({ ...v, filtro: txtFilter, page: 1 }));
  }

  /* Limpiar filtros de busqueda */
  clearFilters() {
    this.optionsPaginated.update((v) => ({ ...v, filtro: '', page: 1 }));
  }

  /* Cambiar estados entre activos e inactivos */
  changeState(number: string) {
    let newState = false;

    if (number == '1') newState = true;

    this.optionsPaginated.set({ estado: newState });
  }

  /* Para saber si hay elementos en el paginado */
  nothingShowInTable = computed<boolean>(
    () =>
      this.dataPaginated()?.totalPages == 0 ||
      this.dataPaginated()?.totalPages == this.dataPaginated()?.page
  );

  /* Cambiar pagina */
  nextPage(page: number) {
    this.optionsPaginated.update((v) => ({ ...v, page }));
  }

  /* Al avanzar o retroceder con los laterales */
  changePage(isNext: boolean) {
    if (isNext) {
      this.nextPage(this.optionsPaginated().page! + 1);
      return;
    }
    this.nextPage(this.optionsPaginated().page! - 1);
  }

  /* Peticion HTTP Paginada y asignacion a un signal */
  httpTeamsPaginated = rxResource({
    request: () => ({ options: this.optionsPaginated() }),
    loader: ({ request }) => {
      return this.teamService.getTeamPaginated(request.options).pipe(
        tap((resp) => {
          if (resp.data) {
            this.dataPaginated.set(resp.data);

            if (resp.data.count == 0)
              this.toastService.show(
                'No se encontraron resultados.',
                'text-bg-danger'
              );
          }
        })
      );
    },
  });

  // ------------------- Modales --------------------------------

  /* Declaracion de modales */
  modalInfo = viewChild<TeamInfoComponent>('modalInfo');
  modalNew = viewChild<TeamAddComponent>('modalNew');
  modalEdit = viewChild<TeamEditComponent>('modalEdit');
  modalDelete = viewChild<TeamDeleteComponent>('modalDelete');

  /* Id generico */
  idTeamManagement = signal<number | null>(null);

  /* Apertura de modal info */
  openModalInfo(id: number) {
    this.idTeamManagement.set(id);
    this.modalInfo()!.show();
  }

  /* Apertura de modal nuevo team */
  openModalAdd() {
    this.modalNew()!.show();
  }

  /* Apertura de modal edit team */
  openModalEdit(id: number) {
    this.idTeamManagement.set(id);
    this.modalEdit()!.show();
  }

  /* Apertura de modal delete team */
  openModalDelete(id: number) {
    this.idTeamManagement.set(id);
    this.modalDelete()!.show();
  }

  reloadTable(reload: boolean) {
    if (!reload) return;
    this.httpTeamsPaginated.reload();
  }
}
