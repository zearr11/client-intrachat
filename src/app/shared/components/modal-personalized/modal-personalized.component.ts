import { Component, ElementRef, input, output, signal, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';
import { entity, modalType } from '../../types/modal.types';
import { UserAddLayoutComponent } from "../../../entity/user/layouts/user-add-layout/user-add-layout.component";
import { UserRequest, UserResponse } from '../../../entity/user/interfaces/user.interface';

@Component({
  selector: 'modal-personalized',
  imports: [
    UserAddLayoutComponent
  ],
  templateUrl: './modal-personalized.component.html',
})
export class ModalPersonalizedComponent {

  // Aplicacion de tamaños <opcionales>
  isSizeXL = input<boolean>(false);
  isSizeLg = input<boolean>(false);
  isFullScreenInXXL = input<boolean>(false);

  // Elementos necesarios
  titleModal = input.required<string>();
  typeEntity = input.required<entity>();
  typeModal = input.required<modalType>();

  // En caso de actualizar estado de entidad es requerido
  messageModal = input<string>('');
  objectToAction = input<string>('');
  messageSecondaryModal = input<string>('');

  // Emision al cerrar el modal (true: confirma, false: nada)
  realizedAction = output<boolean>();

  dataForm = output<UserRequest>();

  @ViewChild('modalElement') modalElement!: ElementRef;
  private modalInstance!: Modal;

  ngAfterViewInit() {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
  }

  show() {
    this.modalInstance.show();
  }

  close(state: boolean) {
    this.realizedAction.emit(state);
    this.modalInstance.hide();
  }

}
