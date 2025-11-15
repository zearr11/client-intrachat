import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { SearchInputDarkComponent } from "../../common/search-input-dark/search-input-dark.component";
import { ActivesInactivesSelectDarkComponent } from "../../common/actives-inactives-select-dark/actives-inactives-select-dark.component";
import { NavTableDarkComponent } from "../../common/nav-table-dark/nav-table-dark.component";
import { ToastMessageService } from '../../../../shared/services/toast-message.service';
import { CampaignService } from '../../../../entity/campaign/services/campaign.service';
import { OptionsPaginated } from '../../../../shared/interfaces/options-paginated.interface';
import { PaginatedResponse } from '../../../../shared/interfaces/paginated-response.interface';
import { CampaignResponse } from '../../../../entity/campaign/interfaces/campaign.interface';
import { CampaignModalInfoComponent } from '../../../../entity/campaign/modals/campaign-modal-info/campaign-modal-info.component';
import { CampaignModalAddComponent } from '../../../../entity/campaign/modals/campaign-modal-add/campaign-modal-add.component';
import { CampaignModalEditComponent } from '../../../../entity/campaign/modals/campaign-modal-edit/campaign-modal-edit.component';
import { CampaignModalChangeStateComponent } from '../../../../entity/campaign/modals/campaign-modal-change-state/campaign-modal-change-state.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { RemoveUnderScorePipe } from '../../../../entity/campaign/pipes/remove-underscore.pipe';

@Component({
  selector: 'campaign-page',
  imports: [
    SearchInputDarkComponent,
    ActivesInactivesSelectDarkComponent,
    NavTableDarkComponent,
    TitleCasePipe,
    RemoveUnderScorePipe,
    DatePipe
  ],
  templateUrl: './campaign-page.component.html',
  styleUrl: './campaign-page.component.css'
})
export class CampaignPageComponent {

  private toastService = inject(ToastMessageService);
  private campaignService = inject(CampaignService);

  elementsTable: string[] = [
    'N°', 'Empresa', 'Area de Atención', 'Medio Comunicación',
    'Fecha de Inicio', ''
  ];

  // ------------------- HTTP Listado --------------------------

  optionsPaginated = signal<OptionsPaginated>({ estado: true });

  /* Data paginada */
  dataPaginated = signal<PaginatedResponse<CampaignResponse> | null>(null);

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
  httpCampaignsPaginated = rxResource(({
    request: () => ({ options: this.optionsPaginated() }),
    loader: ({ request }) => {
      return this.campaignService.getCampaignsPaginated(request.options).pipe(
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
  @ViewChild('modalInfo') modalInfo!: CampaignModalInfoComponent;
  @ViewChild('modalNew') modalNew!: CampaignModalAddComponent;
  @ViewChild('modalEdit') modalEdit!: CampaignModalEditComponent;
  @ViewChild('modalChangeState') modalChangeState!: CampaignModalChangeStateComponent;

  /* Atributos de Info */
  dataInfoCampaign = signal<CampaignResponse | null>(null);

  /* Atributos de Change State */
  idCampaignToChangeState = signal<number | null>(null);
  isDelete = signal<boolean>(false);

  /* Atributos de Edit */
  dataCampaignEdit = signal<CampaignResponse | null>(null);

  /* Apertura de modal info usuario */
  openModalInfo(data: CampaignResponse) {
    this.dataInfoCampaign.set(data);
    // this.modalInfo.show();
  }

  /* Apertura de modal nuevo usario */
  openModalNew() {
    // this.modalNew.show();
  }

  /* Apertura de modal modificar usario */
  openModalEdit(data: CampaignResponse) {
    this.dataCampaignEdit.set(data);
    // this.modalEdit.show();
  }

  /* Apertura de modal cambiar estado de usario */
  openModalChangeState(id: number, isDelete: boolean) {
    this.idCampaignToChangeState.set(id);
    this.isDelete.set(isDelete);
    // this.modalChangeState.show();
  }

  reloadTable(reload: boolean) {
    if (!reload) return;
    this.httpCampaignsPaginated.reload();
  }

}
