import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ToastMessageService } from '../../../../../shared/services/toast-message.service';
import { OperationService } from '../../services/operation.service';
import { UserService } from '../../../../../core/services/user.service';
import { CampaignService } from '../../../campaign/services/campaign.service';
import { HeadquartersService } from '../../../headquarters/services/headquarters.service';
import {
  OptionsPaginated,
  OptionsPaginatedUserOperation,
} from '../../../../../shared/interfaces/options-paginated.interface';
import { OperationRequest } from '../../interfaces/operation.interface';
import { Modal } from 'bootstrap';
import { EntitySimple } from '../../../team/interfaces/entity-simple.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { InfoSimpleMapper } from '../../../team/mapping/info-simple.mapper';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'operation-edit',
  imports: [],
  templateUrl: './operation-edit.component.html',
})
export class OperationEditComponent {
  private operationService = inject(OperationService);
  private toastService = inject(ToastMessageService);
  private userService = inject(UserService);
  private campaignService = inject(CampaignService);
  private headquarterService = inject(HeadquartersService);

  optionsFilterOperationsManagers = signal<OptionsPaginatedUserOperation>({
    page: 1,
    size: 15,
  });
  optionsFilterCampaigns = signal<OptionsPaginated>({
    page: 1,
    estado: true,
    size: 15,
  });
  optionsFilterHeadquarters = signal<OptionsPaginated>({
    page: 1,
    estado: true,
    size: 15,
  });

  /* Signals */
  idOperation = input.required<number | null>();
  dataOperationUpdated = signal<OperationRequest>({});
  updateTable = output<boolean>();

  loadOperationEffect = effect(() => {
    if (!this.idOperation()) return;

    this.optionsFilterOperationsManagers.update((v) => ({
      ...v,
      idOperacion: this.idOperation()!,
    }));

    this.operationService
      .getOperationById(this.idOperation()!)
      .subscribe((data) => {
        if (!data) return;

        const idJefeOperacion = data.datosJefeOperacion.id;
        const idCampaign = data.datosCampania.idCampania;
        const idHeadquarters = data.datosSede.id;

        const dataMapped: OperationRequest = {
          idJefeOperacion: idJefeOperacion,
          idCampania: idCampaign,
          idSede: idHeadquarters,
        };

        this.dataOperationUpdated.set(dataMapped);
      });
  });

  /* Referencia al modal actual */
  modalElement = viewChild<ElementRef<HTMLDivElement>>('modalElement');
  modalInstance = signal<Modal | null>(null);

  /* Asignacion como Elemento Modal */
  ngAfterViewInit() {
    this.modalInstance.set(new Modal(this.modalElement()!.nativeElement));
  }

  /* Mostrar modal */
  show() {
    this.modalInstance()!.show();
  }

  /* Ocultar modal */
  close() {
    this.modalInstance()!.hide();
  }

  operationsManagers = signal<EntitySimple[]>([]);
  campaigns = signal<EntitySimple[]>([]);
  headquarters = signal<EntitySimple[]>([]);

  // Pagina maxima de entidad
  pageMaxOperationsManagers = signal<number>(0);
  pageMaxCampaigns = signal<number>(0);
  pageMaxHeadquarters = signal<number>(0);

  operationsManagersResource = rxResource({
    request: () => ({
      options: this.optionsFilterOperationsManagers(),
    }),
    loader: ({ request }) => {
      return this.userService
        .getUsersWhitoutOperationAndWithOperationPaginated(request.options)
        .pipe(map((resp) => resp.data));
    },
  });

  campaignsResource = rxResource({
    request: () => ({
      options: this.optionsFilterCampaigns(),
    }),
    loader: ({ request }) => {
      return this.campaignService
        .getCampaignsPaginated(request.options)
        .pipe(map((resp) => resp.data));
    },
  });

  headquartersResource = rxResource({
    request: () => ({
      options: this.optionsFilterHeadquarters(),
    }),
    loader: ({ request }) => {
      return this.headquarterService
        .getHeadquartersPaginated(request.options)
        .pipe(map((resp) => resp.data));
    },
  });

  operationManagerEffect = effect(() => {
    const data = this.operationsManagersResource.value();
    const options = this.optionsFilterOperationsManagers();

    if (data) {
      this.pageMaxOperationsManagers.set(data.totalPages);

      let resultTransform = data.result.map((val) =>
        InfoSimpleMapper.transformUser(val)
      );

      resultTransform = resultTransform.map((v) => ({
        ...v,
        isSelected: v.id === this.dataOperationUpdated().idJefeOperacion,
      }));

      this.operationsManagers.update((previous) => {
        if (options.page === 1 || previous.length === 0) {
          return resultTransform;
        }

        const idsPrev = new Set(previous.map((x) => x.id));

        return [
          ...previous,
          ...resultTransform.filter((x) => !idsPrev.has(x.id)),
        ];
      });
    }
  });

  campaignsEffect = effect(() => {
    const data = this.campaignsResource.value();
    const options = this.optionsFilterCampaigns();

    if (data) {
      this.pageMaxCampaigns.set(data.totalPages);

      let resultTransform: EntitySimple[] = data.result.map((val) =>
        InfoSimpleMapper.transformCampaign(val)
      );

      resultTransform = resultTransform.map((v) => ({
        ...v,
        isSelected: v.id === this.dataOperationUpdated().idCampania,
      }));

      this.campaigns.update((previous) => {
        if (options.page === 1 || previous.length === 0) {
          return resultTransform;
        }

        const idsPrev = new Set(previous.map((x) => x.id));

        return [
          ...previous,
          ...resultTransform.filter((x) => !idsPrev.has(x.id)),
        ];
      });
    }
  });

  headquartersEffect = effect(() => {
    const data = this.headquartersResource.value();
    const options = this.optionsFilterHeadquarters();

    if (data) {
      this.pageMaxHeadquarters.set(data.totalPages);

      let resultTransform: EntitySimple[] = data.result.map((val) =>
        InfoSimpleMapper.transformHeadquarters(val)
      );

      resultTransform = resultTransform.map((v) => ({
        ...v,
        isSelected: v.id === this.dataOperationUpdated().idSede,
      }));

      this.headquarters.update((previous) => {
        if (options.page === 1 || previous.length === 0) {
          return resultTransform;
        }

        const idsPrev = new Set(previous.map((x) => x.id));

        return [
          ...previous,
          ...resultTransform.filter((x) => !idsPrev.has(x.id)),
        ];
      });
    }
  });

  selectOperationManager(opManager: EntitySimple, isSelected: boolean) {
    this.operationsManagers.update((list) =>
      list.map((x) => ({
        ...x,
        isSelected: x.id === opManager.id ? isSelected : false,
      }))
    );

    this.dataOperationUpdated.update((v) => ({
      ...v,
      idJefeOperacion: isSelected ? opManager.id : undefined,
    }));
  }

  selectCampaign(campaign: EntitySimple, isSelected: boolean) {
    this.campaigns.update((list) =>
      list.map((x) => ({
        ...x,
        isSelected: x.id === campaign.id ? isSelected : false,
      }))
    );

    this.dataOperationUpdated.update((v) => ({
      ...v,
      idCampania: isSelected ? campaign.id : undefined,
    }));
  }

  selectHeadquarters(headquarterEnt: EntitySimple, isSelected: boolean) {
    this.headquarters.update((list) =>
      list.map((x) => ({
        ...x,
        isSelected: x.id === headquarterEnt.id ? isSelected : false,
      }))
    );

    this.dataOperationUpdated.update((v) => ({
      ...v,
      idSede: isSelected ? headquarterEnt.id : undefined,
    }));
  }

  filterOperationManager(txt: string) {
    this.optionsFilterOperationsManagers.set({
      page: 1,
      size: 15,
      idOperacion: this.idOperation()!,
      filtro: txt,
    });
  }

  filterCampaign(txt: string) {
    this.optionsFilterCampaigns.set({
      page: 1,
      estado: true,
      size: 15,
      filtro: txt,
    });
  }

  filterHeadquarters(txt: string) {
    this.optionsFilterHeadquarters.set({
      page: 1,
      estado: true,
      size: 15,
      filtro: txt,
    });
  }

  private threshold = 50;

  onScrollOperationManager(ev: Event) {
    const div = ev.target as HTMLElement;

    const distanceToBottom =
      div.scrollHeight - (div.scrollTop + div.clientHeight);

    if (distanceToBottom <= this.threshold) {
      const currentPage = this.optionsFilterOperationsManagers().page;

      if (currentPage! < this.pageMaxOperationsManagers()) {
        this.optionsFilterOperationsManagers.update((prev) => ({
          ...prev,
          page: prev.page! + 1,
        }));
      }
    }
  }

  onScrollCampaigns(ev: Event) {
    const div = ev.target as HTMLElement;

    const distanceToBottom =
      div.scrollHeight - (div.scrollTop + div.clientHeight);

    if (distanceToBottom <= this.threshold) {
      const currentPage = this.optionsFilterCampaigns().page;

      if (currentPage! < this.pageMaxCampaigns()) {
        this.optionsFilterCampaigns.update((prev) => ({
          ...prev,
          page: prev.page! + 1,
        }));
      }
    }
  }

  onScrollHeadquarters(ev: Event) {
    const div = ev.target as HTMLElement;

    const distanceToBottom =
      div.scrollHeight - (div.scrollTop + div.clientHeight);

    if (distanceToBottom <= this.threshold) {
      const currentPage = this.optionsFilterHeadquarters().page;

      if (currentPage! < this.pageMaxHeadquarters()) {
        this.optionsFilterHeadquarters.update((prev) => ({
          ...prev,
          page: prev.page! + 1,
        }));
      }
    }
  }

  updateOperation() {
    if (!this.dataOperationUpdated().idJefeOperacion) {
      this.toastService.show(
        'Debe seleccionar un jefe de operación.',
        'text-bg-danger'
      );
      return;
    }

    if (!this.dataOperationUpdated().idCampania) {
      this.toastService.show('Debe seleccionar una campaña.', 'text-bg-danger');
      return;
    }

    if (!this.dataOperationUpdated().idSede) {
      this.toastService.show('Debe seleccionar una sede.', 'text-bg-danger');
      return;
    }

    this.operationService
      .updateOperation(this.idOperation()!, this.dataOperationUpdated())
      .subscribe({
        next: (msg) => {
          if (msg) {
            this.toastService.show(
              'Operación actualizada satisfactoriamente.',
              'text-bg-success'
            );
            this.updateTable.emit(true);
            this.close();
          }
        }
      });
  }
}
