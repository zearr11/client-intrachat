import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';

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
