import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../../entity/user/services/user.service';
import { Role } from '../../../../entity/user/interfaces/role-user.interface';
import { AuthService } from '../../../../entity/user/services/auth.service';
import { PanelAccessService } from '../../services/panel-access.service';
declare var bootstrap: any;

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink
],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export default class LoginPageComponent {

  fb = inject(FormBuilder);
  hasError = signal(false);
  messageError = signal<string|null>(null);
  router = inject(Router)

  authService = inject(AuthService);
  userService = inject(UserService);
  panelAccessService = inject(PanelAccessService);

  ngAfterViewChecked() {
    // Solo inicializa cuando el toast aparece
    if (this.hasError()) {
      const toastEl = document.getElementById('errorToast');
      if (toastEl) {
        const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
        toast.show();
      }
    }
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError.set(true);
      this.messageError.set('Verifica la información ingresada e intente nuevamente.')
      setTimeout(() => {
        this.hasError.set(false);
        this.messageError.set(null);
      }, 3000);
      return;
    }

    const { email = '', password = '' } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe((isSuccessAccess) => {
      if (isSuccessAccess) {
        this.panelAccessService.showPanelByRole();
        return;
      }

      this.hasError.set(true);
      this.messageError.set(this.authService.message());
      setTimeout(() => {
        this.hasError.set(false);
        this.messageError.set(null);
      }, 3000);
    });
  }

}
