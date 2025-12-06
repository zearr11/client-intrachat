import { Component, computed, ElementRef, inject, input, output, signal, ViewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Modal } from 'bootstrap';
import { UserResponse } from '../../../../../core/interfaces/user.interface';
import { map, of, tap } from 'rxjs';
import { ToastMessageService } from '../../../../../shared/services/toast-message.service';
import { UserService } from '../../../../../core/services/user.service';

@Component({
  selector: 'user-change-state',
  imports: [],
  templateUrl: './user-change-state.component.html',
})
export class UserChangeStateComponent {

  private userService = inject(UserService);
  private toastService = inject(ToastMessageService);

  isDelete = input.required<boolean>();
  idUser = input.required<number>();
  updateTable = output<boolean>();

  dataUser = signal<UserResponse | null>(null);
  newState = signal<boolean | null>(null);

  /* Referencia al modal actual */
  @ViewChild('modalElement') modalElement!: ElementRef;
  private modalInstance!: Modal;

  /* Asignacion como Elemento Modal */
  ngAfterViewInit() {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
  }

  /* Mostrar modal */
  show() {
    this.modalInstance.show();
  }

  /* Ocultar modal */
  close() {
    this.modalInstance.hide();
  }

  /* Ejecutar cambio de estado */
  confirmAction() {
    if (!this.idUser() || !this.dataUser()) return;

    this.newState.set(!this.isDelete())

    this.httpChangeState().subscribe(() => {
      this.updateTable.emit(true);
      this.toastService.show(this.msgConfirmAction()!, this.colorActionToast()!);
      this.close();
    });
  }

  /* -------------------------- HTTP Peticiones -------------------------- */

  httpGetUserById = rxResource(({
    request: () => ({ id: this.idUser() }),
    loader: ({ request }) => {
      if (!request.id) return of({ error: true });

      return this.userService.getUserById(request.id).pipe(
        tap(resp => this.dataUser.set(resp)),
        map(() => ({ error: false }))
      );
    }
  }));

  httpChangeState() {
    return this.userService.updateDataUser(
      this.idUser(), { estado: this.newState()! }
    );
  }

  /* ---------------------- Atributos del modal -------------------------- */

  titleModal = computed(() => {
    if (this.isDelete() == null)
      return;

    return this.isDelete() ? 'Deshabilitar Usuario' : 'Habilitar Usuario';
  });

  messageModal = computed(() => {
    if (this.isDelete() == null)
      return;

    return this.isDelete()
      ? '¿Estás seguro de querer deshabilitar la cuenta del usuario'
      : '¿Estás seguro de querer habilitar la cuenta del usuario';
  });

  fullNameUser = computed(() => {
    return this.dataUser()?.nombres + ' ' + this.dataUser()?.apellidos;
  });

  messageFooter = computed(() => {
    if (this.isDelete() == null)
      return;

    return this.isDelete()
      ? 'Nota: El usuario dejará de tener acceso a la plataforma.'
      : 'Nota: El usuario podrá acceder nuevamente a la plataforma.';
  });

  msgConfirmDelete = computed(() => {
    if (this.isDelete() == null)
      return;

    return this.isDelete()
      ? 'Si, quiero deshabilitarlo.'
      : 'Si, quiero habilitarlo.';
  })

  msgConfirmAction = computed(() => {
    if (this.isDelete() == null)
      return;

    return this.isDelete()
      ? 'Usuario deshabilitado satisfactoriamente.'
      : 'Usuario habilitado satisfactoriamente.';
  });

  colorActionToast = computed(() => {
    if (this.isDelete() == null)
      return;

    return this.isDelete()
      ? 'text-bg-danger'
      : 'text-bg-primary';
  })

}
