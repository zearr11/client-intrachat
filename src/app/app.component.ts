import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastMessageComponent } from "./shared/components/toast-message/toast-message.component";
import { ToastMessageService } from './shared/services/toast-message.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastMessageComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {

  @ViewChild('toast') toast!: ToastMessageComponent;

  constructor(private toastService: ToastMessageService) {}

  ngAfterViewInit() {
    this.toastService.register(this.toast);
  }

}
