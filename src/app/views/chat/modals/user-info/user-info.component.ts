import { Component, ElementRef, input, signal, viewChild } from '@angular/core';
import { UserResponse } from '../../../../entity/user/interfaces/user.interface';
import { Modal } from 'bootstrap';

@Component({
  selector: 'user-info',
  imports: [],
  templateUrl: './user-info.component.html',
})
export class UserInfoComponent {
  userData = input.required<UserResponse | null>();

  modalElement = viewChild<ElementRef<HTMLDivElement>>('modalElement');
  private modalInstance!: Modal;

  /* Asignacion como Elemento Modal */
  ngAfterViewInit() {
    this.modalInstance = new Modal(this.modalElement()!.nativeElement);
  }

  /* Mostrar modal */
  show() {
    this.modalInstance.show();
  }

  /* Ocultar modal */
  close() {
    this.modalInstance.hide();
  }
}
