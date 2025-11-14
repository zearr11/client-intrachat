import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';
import { entity, modalType } from '../../types/modal.types';

@Component({
  selector: 'modal-personalized',
  imports: [],
  templateUrl: './modal-personalized.component.html',
})
export class ModalPersonalizedComponent {

  isSizeXL = signal<boolean>(false);
  isSizeLg = signal<boolean>(false);
  isFullScreenInXXL = signal<boolean>(false);

  titleModal = signal<string>('');
  typeEntity = signal<entity | null>(null);
  typeModal = signal<modalType | null>(null);

  deleteElement = signal<boolean>(false);

  changeStateDeleteValue() {
    this.deleteElement.update((v) => !v);
  }

  @ViewChild('modalElement') modalElement!: ElementRef;
  private modalInstance!: Modal;

  ngAfterViewInit() {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
  }

  openModal() {
    if (this.modalElement) {
      this.modalInstance.show();
    }
  }

}
