import { Injectable } from '@angular/core';
import { ModalPersonalizedComponent } from '../components/modal-personalized/modal-personalized.component';
import { entity, modalType } from '../types/modal.types';

@Injectable({providedIn: 'root'})
export class ModalPersonalizedService {

  private modalRef?: ModalPersonalizedComponent;

  register(modal: ModalPersonalizedComponent) {
    this.modalRef = modal;
  }

  stateDeleteElement() {
    if (!this.modalRef)
      return;

    return this.modalRef.deleteElement();
  }

  changeStatetDeleteElement() {
    if (!this.modalRef)
      return;

    this.modalRef.changeStateDeleteValue();
  }

  show(options:
    {
      isSizeXL?: boolean,
      isSizeLg?: boolean,
      isFullScreenInXXL?: boolean,
      titleModal: string,
      typeEntity: entity,
      typeModal: modalType
    }
  ) {
    if (!this.modalRef)
      return;

    if (options?.isSizeXL != null) this.modalRef.isSizeXL.set(options.isSizeXL);
    if (options?.isSizeLg != null) this.modalRef.isSizeLg.set(options.isSizeLg);
    if (options?.isFullScreenInXXL != null)
      this.modalRef.isFullScreenInXXL.set(options.isFullScreenInXXL);

    this.modalRef.titleModal.set(options?.titleModal!);
    this.modalRef.typeEntity.set(options?.typeEntity!);
    this.modalRef.typeModal.set(options?.typeModal!);

    this.modalRef.openModal();
  }

}
