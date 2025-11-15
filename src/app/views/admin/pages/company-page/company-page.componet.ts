import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { SearchInputDarkComponent } from "../../common/search-input-dark/search-input-dark.component";
import { ActivesInactivesSelectDarkComponent } from "../../common/actives-inactives-select-dark/actives-inactives-select-dark.component";
import { NavTableDarkComponent } from "../../common/nav-table-dark/nav-table-dark.component";
import { CompanyModalInfoComponent } from "../../../../entity/company/modals/company-modal-info/company-modal-info.component";
import { CompanyModalAddComponent } from "../../../../entity/company/modals/company-modal-add/company-modal-add.component";
import { CompanyModalEditComponent } from "../../../../entity/company/modals/company-modal-edit/company-modal-edit.component";
import { CompanyModalChangeStateComponent } from "../../../../entity/company/modals/company-modal-change-state/company-modal-change-state.component";
import { ToastMessageService } from '../../../../shared/services/toast-message.service';
import { CompanyService } from '../../../../entity/company/services/company.service';
import { PaginatedResponse } from '../../../../shared/interfaces/paginated-response.interface';
import { CompanyResponse } from '../../../../entity/company/interfaces/company.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { CompanyOptionsRequest } from '../../../../entity/company/interfaces/company-options-request';
import { map, tap } from 'rxjs';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'company-page',
  imports: [
    SearchInputDarkComponent,
    ActivesInactivesSelectDarkComponent,
    NavTableDarkComponent,
    TitleCasePipe,
    CompanyModalInfoComponent,
    CompanyModalAddComponent,
    CompanyModalEditComponent,
    CompanyModalChangeStateComponent
  ],
  templateUrl: './company-page.componet.html',
  styleUrl: './company-page.component.css'
})
export class CompanyPageComponet {

  private toastService = inject(ToastMessageService);
  private companyService = inject(CompanyService);

  elementsTable: string[] = [
    'N°', 'Empresa', 'Estado', ''
  ];

  // ------------------- HTTP Listado --------------------------

  optionsPaginated = signal<CompanyOptionsRequest>({ estado: true });

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
  @ViewChild('modalInfo') modalInfo!: CompanyModalInfoComponent;
  @ViewChild('modalNew') modalNew!: CompanyModalAddComponent;
  @ViewChild('modalEdit') modalEdit!: CompanyModalEditComponent;
  @ViewChild('modalChangeState') modalChangeState!: CompanyModalChangeStateComponent;

  /* Atributos de Info */
  dataInfoCompany = signal<CompanyResponse | null>(null);

  /* Atributos de Change State */
  idCompanyToChangeState = signal<number | null>(null);
  isDelete = signal<boolean>(false);

  /* Atributos de Edit */
  dataCompanyEdit = signal<CompanyResponse | null>(null);

  /* Apertura de modal info usuario */
  openModalInfo(data: CompanyResponse) {
    this.dataInfoCompany.set(data);
    // this.modalInfo.show();
  }

  /* Apertura de modal nuevo usario */
  openModalNew() {
    // this.modalNew.show();
  }

  /* Apertura de modal modificar usario */
  openModalEdit(data: CompanyResponse) {
    this.dataCompanyEdit.set(data);
    // this.modalEdit.show();
  }

  /* Apertura de modal cambiar estado de usario */
  openModalChangeState(id: number, isDelete: boolean) {
    this.idCompanyToChangeState.set(id);
    this.isDelete.set(isDelete);
    // this.modalChangeState.show();
  }

  reloadTable(reload: boolean) {
    if (!reload) return;
    this.httpCompanysPaginated.reload();
  }

}
