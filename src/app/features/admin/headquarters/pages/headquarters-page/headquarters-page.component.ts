import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { SearchInputDarkComponent } from '../../../../../shared/common/search-input-dark/search-input-dark.component';
import { ActivesInactivesSelectDarkComponent } from '../../../../../shared/common/actives-inactives-select-dark/actives-inactives-select-dark.component';
import { NavTableDarkComponent } from '../../../../../shared/common/nav-table-dark/nav-table-dark.component';
import { ToastMessageService } from '../../../../../shared/services/toast-message.service';
import { HeadquartersService } from '../../services/headquarters.service';
import { OptionsPaginated } from '../../../../../shared/interfaces/options-paginated.interface';
import { PaginatedResponse } from '../../../../../shared/interfaces/paginated-response.interface';
import { HeadquartersResponse } from '../../interfaces/headquarters.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { HeadquartersAddComponent } from '../../components/headquarters-add/headquarters-add.component';
import { HeadquartersChangeStateComponent } from '../../components/headquarters-change-state/headquarters-change-state.component';
import { HeadquartersEditComponent } from '../../components/headquarters-edit/headquarters-edit.component';

@Component({
  selector: 'sede-page',
  imports: [
    SearchInputDarkComponent,
    ActivesInactivesSelectDarkComponent,
    NavTableDarkComponent,
    HeadquartersAddComponent,
    HeadquartersEditComponent,
    HeadquartersChangeStateComponent
],
  templateUrl: './headquarters-page.component.html',
  styleUrl: './headquarters-page.component.css',
})
export class HeadquartersPageComponent {
  private toastService = inject(ToastMessageService);
  private headquartersService = inject(HeadquartersService);

  elementsTable: string[] = ['N°', 'Nombre', 'Dirección', 'Código Postal', ''];

  // ------------------- HTTP Listado --------------------------

  optionsPaginated = signal<OptionsPaginated>({ estado: true });

  /* Data paginada */
  dataPaginated = signal<PaginatedResponse<HeadquartersResponse> | null>(null);

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
  httpHeadquartersPaginated = rxResource({
    request: () => ({ options: this.optionsPaginated() }),
    loader: ({ request }) => {
      return this.headquartersService
        .getHeadquartersPaginated(request.options)
        .pipe(
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
  @ViewChild('modalNew') modalNew!: HeadquartersAddComponent;
  @ViewChild('modalEdit') modalEdit!: HeadquartersEditComponent;
  @ViewChild('modalChangeState')
  modalChangeState!: HeadquartersChangeStateComponent;

  /* Atributos de Change State */
  idHeadquartersToChangeState = signal<number | null>(null);
  isDelete = signal<boolean>(false);

  /* Atributos de Edit */
  dataHeadquartersEdit = signal<HeadquartersResponse | null>(null);

  /* Apertura de modal ADD */
  openModalNew() {
    this.modalNew.show();
  }

  /* Apertura de modal modificar */
  openModalEdit(data: HeadquartersResponse) {
    this.dataHeadquartersEdit.set(data);
    this.modalEdit.show();
  }

  /* Apertura de modal cambiar estado */
  openModalChangeState(id: number, isDelete: boolean) {
    this.idHeadquartersToChangeState.set(id);
    this.isDelete.set(isDelete);
    this.modalChangeState.show();
  }

  reloadTable(reload: boolean) {
    if (!reload) return;
    this.httpHeadquartersPaginated.reload();
  }
}
