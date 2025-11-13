import { Injectable } from '@angular/core';
import { ToastMessageComponent } from '../components/toast-message/toast-message.component';

@Injectable({ providedIn: 'root' })
export class ToastMessageService {

  private toastRef?: ToastMessageComponent;

  register(toast: ToastMessageComponent) {
    this.toastRef = toast;
  }

  /** Mostrar mensaje */
  show(message: string, color: string) {
    if (!this.toastRef) return;
    this.toastRef.message.set(message);
    this.toastRef.color.set(color);
    this.toastRef.show();
  }

}
