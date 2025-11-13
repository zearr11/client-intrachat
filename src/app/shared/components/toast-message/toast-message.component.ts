import { NgClass } from '@angular/common';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { Toast } from 'bootstrap';

@Component({
  selector: 'toast-message',
  imports: [NgClass],
  templateUrl: './toast-message.component.html',
})
export class ToastMessageComponent {

  message = signal<string>('');
  color = signal<string>('');

  @ViewChild('toastEl') toastEl!: ElementRef;

  private toastInstance!: Toast;

  ngAfterViewInit() {
    this.toastInstance = new Toast(this.toastEl.nativeElement, {
      delay: 2000,
    });
  }

  show() {
    this.toastInstance.show();
  }

  /** (Opcional) Ocultar */
  hide() {
    this.toastInstance.hide();
  }

}

