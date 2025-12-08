import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CampaignService } from '../../services/campaign.service';
import { ToastMessageService } from '../../../../../shared/services/toast-message.service';
import { CampaignResponse } from '../../interfaces/campaign.interface';
import { Modal } from 'bootstrap';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'campaign-change-state',
  imports: [],
  templateUrl: './campaign-change-state.component.html',
})
export class CampaignChangeStateComponent {
  private campaignService = inject(CampaignService);
  private toastService = inject(ToastMessageService);

  isDelete = input.required<boolean>();
  idCampaign = input.required<number>();
  updateTable = output<boolean>();

  dataCampaign = signal<CampaignResponse | null>(null);
  newState = signal<boolean | null>(null);

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

  confirmAction() {
    if (!this.idCampaign() || !this.dataCampaign()) return;
    this.newState.set(!this.isDelete());

    this.httpChangeState().subscribe({
      next: (resp) => {
        this.updateTable.emit(true);
        this.toastService.show(
          this.msgConfirmAction(),
          this.colorActionToast()
        );
        this.close();
      },
      error: (err: HttpErrorResponse) => {
        this.toastService.show(err.message, 'text-bg-danger');
        this.close();
      },
    });
  }

  /* -------------------------- HTTP Peticiones -------------------------- */

  httpGetCampaignById = rxResource({
    request: () => ({ id: this.idCampaign() }),
    loader: ({ request }) => {
      if (!request.id) return of({ error: true });

      return this.campaignService.getCampaignById(request.id).pipe(
        tap((resp) => this.dataCampaign.set(resp.data)),
        map(() => ({ error: false }))
      );
    },
  });

  httpChangeState() {
    return this.campaignService.updateCampaign(this.idCampaign(), {
      estado: this.newState()!,
    });
  }

  /* ---------------------- Atributos del modal -------------------------- */

  titleModal = computed(() => {
    if (this.isDelete() == null) return;

    return this.isDelete() ? 'Deshabilitar Campaña' : 'Habilitar Campaña';
  });

  messageModal = computed(() => {
    if (this.isDelete() == null) return;

    return this.isDelete()
      ? '¿Estás seguro de querer deshabilitar la campaña'
      : '¿Estás seguro de querer habilitar la campaña';
  });

  fullNameCampaign = computed(() => {
    return `"${this.dataCampaign()?.nombre}"`;
  });

  messageFooter = computed(() => {
    if (this.isDelete() == null) return;

    return this.isDelete()
      ? 'Nota: La campaña no podrá seleccionarse al gestionar operaciones.'
      : 'Nota: La campaña podrá seleccionarse nuevamente al gestionar operaciones.';
  });

  msgConfirmDelete = computed(() => {
    if (this.isDelete() == null) return;

    return this.isDelete()
      ? 'Si, quiero deshabilitarlo.'
      : 'Si, quiero habilitarlo.';
  });

  msgConfirmAction = computed(() => {
    if (this.isDelete() == null) return '';

    return this.isDelete()
      ? 'Campaña deshabilitada satisfactoriamente.'
      : 'Campaña habilitada satisfactoriamente.';
  });

  colorActionToast = computed(() => {
    if (this.isDelete() == null) return '';

    return this.isDelete() ? 'text-bg-danger' : 'text-bg-primary';
  });
}
