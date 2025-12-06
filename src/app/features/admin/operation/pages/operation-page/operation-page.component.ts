import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivesInactivesSelectDarkComponent } from '../../../../../shared/common/actives-inactives-select-dark/actives-inactives-select-dark.component';
import { NavTableDarkComponent } from '../../../../../shared/common/nav-table-dark/nav-table-dark.component';
import { DatePipe } from '@angular/common';
import {
  EntitySimpleGeneric,
  FilterSelectComponent,
} from '../../../../../shared/common/filter-select/filter-select.component';
import { ToastMessageService } from '../../../../../shared/services/toast-message.service';
import { OperationService } from '../../services/operation.service';
import { CampaignService } from '../../../campaign/services/campaign.service';
import { OptionsPaginatedOperation } from '../../../../../shared/interfaces/options-paginated.interface';
import { PaginatedResponse } from '../../../../../shared/interfaces/paginated-response.interface';
import { OperationSpecialResponse } from '../../interfaces/operation.interface';
import { CampaignSimpleResponse } from '../../../campaign/interfaces/campaign.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'operation-page',
  imports: [
    ActivesInactivesSelectDarkComponent,
    NavTableDarkComponent,
    DatePipe,
    FilterSelectComponent,
  ],
  templateUrl: './operation-page.component.html',
  styleUrl: './operation-page.component.css',
})
export class OperationPageComponent {
  private toastService = inject(ToastMessageService);
  private operationService = inject(OperationService);
  private campaignService = inject(CampaignService);

  elementsTable: string[] = [
    'N°',
    'Jefe de Operación',
    'Sede',
    'Campaña',
    'Eq. Operativos',
    'Eq. Inoperativos',
    'U. Activos',
    'U. Inactivos',
    'Creación',
    'Finalización',
    '',
  ];

  // ------------------- HTTP Listado --------------------------

  optionsPaginated = signal<OptionsPaginatedOperation>({ estado: true });

  /* Data paginada */
  dataPaginated = signal<PaginatedResponse<OperationSpecialResponse> | null>(
    null
  );

  dataCampaigns = signal<CampaignSimpleResponse[]>([]);

  campaignEffect = effect(() => {
    if (this.dataCampaigns().length > 0) return;

    this.dataCampaigns.update((current) => [
      ...current,
      { id: 0, campania: 'Mostrar todas las campañas' },
    ]);

    this.campaignService.getCampaignSimpleList().subscribe((result) => {
      this.dataCampaigns.update((previous) => [...previous, ...result.data!]);
    });
  });

  genericCampaingTransform = computed(() => {
    if (!this.dataCampaigns()) return [];

    return this.dataCampaigns().map((item) => {
      const generic: EntitySimpleGeneric = {
        id: item.id,
        element: item.campania,
      };
      return generic;
    });
  });

  /* Buscar por campania en la tabla */
  applyCampaignFilter(idCampania: number) {
    if (idCampania == 0) {
      this.clearFilters();
      return;
    }
    this.optionsPaginated.update((v) => ({ ...v, idCampania, page: 1 }));
  }

  /* Limpiar filtros de busqueda */
  clearFilters() {
    this.optionsPaginated.update((v) => ({ page: 1, estado: true }));
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
  httpCampaignsPaginated = rxResource({
    request: () => ({ options: this.optionsPaginated() }),
    loader: ({ request }) => {
      return this.operationService.getOperationPaginated(request.options).pipe(
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
}
