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
import { HeadquartersService } from '../../services/headquarters.service';
import { ToastMessageService } from '../../../../../shared/services/toast-message.service';
import { HeadquartersResponse } from '../../interfaces/headquarters.interface';
import { Modal } from 'bootstrap';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseGeneric } from '../../../../../shared/interfaces/general-response.interface';

@Component({
  selector: 'headquarters-change-state',
  imports: [],
  templateUrl: './headquarters-change-state.component.html',
})
export class HeadquartersChangeStateComponent {
  private headquartersService = inject(HeadquartersService);
  private toastService = inject(ToastMessageService);

  isDelete = input.required<boolean>();
  idHeadquarters = input.required<number>();
  updateTable = output<boolean>();

  dataHeadquarters = signal<HeadquartersResponse | null>(null);
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

  /* Ejecutar cambio de estado */
  confirmAction() {
    if (!this.idHeadquarters() || !this.dataHeadquarters()) return;

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
        const msg = (err.error as ResponseGeneric<null>).message!;
        this.toastService.show(msg, 'text-bg-danger');
        this.close();
      },
    });
  }

  /* -------------------------- HTTP Peticiones -------------------------- */

  httpGetHeadqueartersById = rxResource({
    request: () => ({ id: this.idHeadquarters() }),
    loader: ({ request }) => {
      if (!request.id) return of({ error: true });

      return this.headquartersService.getHeadquartersById(request.id).pipe(
        tap((data) => this.dataHeadquarters.set(data)),
        map(() => ({ error: false }))
      );
    },
  });

  httpChangeState() {
    return this.headquartersService.updateHeadquarters(this.idHeadquarters(), {
      estado: this.newState()!,
    });
  }

  /* ---------------------- Atributos del modal -------------------------- */

  titleModal = computed(() => {
    if (this.isDelete() == null) return;

    return this.isDelete() ? 'Deshabilitar Sede' : 'Habilitar Sede';
  });

  messageModal = computed(() => {
    if (this.isDelete() == null) return;

    return this.isDelete()
      ? '¿Estás seguro de querer deshabilitar la sede'
      : '¿Estás seguro de querer habilitar la sede';
  });

  fullNameHeadquarters = computed(() => {
    return this.dataHeadquarters()?.nombre;
  });

  messageFooter = computed(() => {
    if (this.isDelete() == null) return;

    return this.isDelete()
      ? 'Nota: La sede no podrá seleccionarse al gestionar operaciones.'
      : 'Nota: La sede podrá seleccionarse nuevamente al gestionar operaciones.';
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
      ? 'Sede deshabilitada satisfactoriamente.'
      : 'Sede habilitada satisfactoriamente.';
  });

  colorActionToast = computed(() => {
    if (this.isDelete() == null) return '';

    return this.isDelete() ? 'text-bg-danger' : 'text-bg-primary';
  });
}
