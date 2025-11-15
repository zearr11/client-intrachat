import { DatePipe, NgClass } from '@angular/common';
import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { UserResponse } from '../../interfaces/user.interface';
import { Modal } from 'bootstrap';

@Component({
  selector: 'user-modal-info',
  imports: [
    NgClass,
    DatePipe
  ],
  templateUrl: './user-modal-info.component.html',
})
export class UserModalInfoComponent {

  user = input.required<UserResponse>();

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
  // close() {
  //   this.modalInstance.hide();
  // }


}
