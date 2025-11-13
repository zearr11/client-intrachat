import { Injectable } from '@angular/core';
import { ModalPersonalizedComponent } from '../components/modal-personalized/modal-personalized.component';

@Injectable({providedIn: 'root'})
export class ModalPersonalizedService {

  private modalRef?: ModalPersonalizedComponent;

  register(modal: ModalPersonalizedComponent) {
    this.modalRef = modal;
  }

  show() {
    // falta agregar
    if (!this.modalRef) return;
    this.modalRef.openModal();
  }

}
