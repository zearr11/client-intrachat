import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { SearchInputDarkComponent } from '../../../../../shared/common/search-input-dark/search-input-dark.component';
import { ActivesInactivesSelectDarkComponent } from '../../../../../shared/common/actives-inactives-select-dark/actives-inactives-select-dark.component';
import { NavTableDarkComponent } from '../../../../../shared/common/nav-table-dark/nav-table-dark.component';
import { CompanyAddComponent } from '../../components/company-add/company-add.component';
import { CompanyEditComponent } from '../../components/company-edit/company-edit.component';
import { CompanyChangeStateComponent } from '../../components/company-change-state/company-change-state.component';
import { ToastMessageService } from '../../../../../shared/services/toast-message.service';
import { CompanyService } from '../../services/company.service';
import { OptionsPaginated } from '../../../../../shared/interfaces/options-paginated.interface';
import { PaginatedResponse } from '../../../../../shared/interfaces/paginated-response.interface';
import { CompanyResponse } from '../../interfaces/company.interface';
import { tap } from 'rxjs';

@Component({
  selector: 'company-page',
  imports: [
    SearchInputDarkComponent,
    ActivesInactivesSelectDarkComponent,
    NavTableDarkComponent,
    CompanyAddComponent,
    CompanyEditComponent,
    CompanyChangeStateComponent
  ],
  templateUrl: './company-page.component.html',
  styleUrl: './company-page.component.css'
})
export class CompanyPageComponent {

  private toastService = inject(ToastMessageService);
  private companyService = inject(CompanyService);

  elementsTable: string[] = [
    'N°', 'Razón Social', 'Nombre Comercial', 'RUC', 'Correo', 'Teléfono', ''
  ];

  // ------------------- HTTP Listado --------------------------

  optionsPaginated = signal<OptionsPaginated>({ estado: true });

  /* Data paginada */
  dataPaginated = signal<PaginatedResponse<CompanyResponse> | null>(null);

  /* Buscar por filtro en la tabla */
  setFilterPaginated(txtFilter: string) {
    this.optionsPaginated.update(v => ({ ...v, filtro: txtFilter, page: 1 }));
  }

  /* Limpiar filtros de busqueda */
  clearFilters() {
    this.optionsPaginated.update(v => ({ ...v, filtro: '', page: 1 }));
  }

  /* Cambiar estados entre activos e inactivos */
  changeState(number: string) {
    let newState = false;

    if (number == '1')
      newState = true;

    this.optionsPaginated.set({ estado: newState });
  }

  /* Para saber si hay elementos en el paginado */
  nothingShowInTable = computed<boolean>(() =>
    this.dataPaginated()?.totalPages == 0
    || this.dataPaginated()?.totalPages == this.dataPaginated()?.page
  );

  /* Cambiar pagina */
  nextPage(page: number) {
    this.optionsPaginated.update(v => ({ ...v, page }));
  }

  /* Al avanzar o retroceder con los laterales */
  changePage(isNext: boolean) {
    if (isNext) {
      this.nextPage((this.optionsPaginated().page! + 1))
      return;
    }
    this.nextPage((this.optionsPaginated().page! - 1))
  }

  /* Peticion HTTP Paginada y asignacion a un signal */
  httpCompanysPaginated = rxResource(({
    request: () => ({ options: this.optionsPaginated() }),
    loader: ({ request }) => {
      return this.companyService.getCompanysPaginated(request.options).pipe(
        tap(resp => {
          if (resp.data) {
            this.dataPaginated.set(resp.data);

            if (resp.data.count == 0)
              this.toastService.show('No se encontraron resultados.', 'text-bg-danger')
          }
        })
      );
    }
  }));

  // ------------------- Modales --------------------------------

  /* Declaracion de modales */
  @ViewChild('modalNew') modalNew!: CompanyAddComponent;
  @ViewChild('modalEdit') modalEdit!: CompanyEditComponent;
  @ViewChild('modalChangeState') modalChangeState!: CompanyChangeStateComponent;

  /* Atributos de Change State */
  idCompanyToChangeState = signal<number | null>(null);
  isDelete = signal<boolean>(false);

  /* Atributos de Edit */
  dataCompanyEdit = signal<CompanyResponse | null>(null);

  /* Apertura de modal nueva empresa */
  openModalNew() {
    this.modalNew.show();
  }

  /* Apertura de modal modificar empresa */
  openModalEdit(data: CompanyResponse) {
    this.dataCompanyEdit.set(data);
    this.modalEdit.show();
  }

  /* Apertura de modal cambiar estado de empresa */
  openModalChangeState(id: number, isDelete: boolean) {
    this.idCompanyToChangeState.set(id);
    this.isDelete.set(isDelete);
    this.modalChangeState.show();
  }

  reloadTable(reload: boolean) {
    if (!reload) return;
    this.httpCompanysPaginated.reload();
  }

}
