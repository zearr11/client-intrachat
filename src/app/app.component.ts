import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastMessageComponent } from "./shared/components/toast-message/toast-message.component";
import { ToastMessageService } from './shared/services/toast-message.service';
import { ModalPersonalizedComponent } from "./shared/components/modal-personalized/modal-personalized.component";
import { ModalPersonalizedService } from './shared/services/modal-personalized.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, ToastMessageComponent, ModalPersonalizedComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {

  @ViewChild('toast') toast!: ToastMessageComponent;
  @ViewChild('modal') modal!: ModalPersonalizedComponent;

  private _toastService = inject(ToastMessageService);
  private _modalService = inject(ModalPersonalizedService);

  ngAfterViewInit() {
    this._toastService.register(this.toast);
    this._modalService.register(this.modal);
  }

}
