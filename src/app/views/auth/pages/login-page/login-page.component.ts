import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../entity/user/services/user.service';
import { AuthService } from '../../services/auth.service';
import { PanelAccessService } from '../../services/panel-access.service';
import { ToastMessageService } from '../../../../shared/services/toast-message.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export default class LoginPageComponent {

  fb = inject(FormBuilder);

  authService = inject(AuthService);
  userService = inject(UserService);
  panelAccessService = inject(PanelAccessService);
  toastService = inject(ToastMessageService);

  showToastMessage(message: string, colorMessage: string) {
    this.toastService.show(message, colorMessage)
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.showToastMessage(
        'Verifica la información ingresada e intente nuevamente.',
        'text-bg-danger'
      );
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe((isSuccessAccess) => {

      // Acceso correcto
      if (isSuccessAccess) {
        this.panelAccessService.showPanelByRole();
        this.showToastMessage(
          `Bienvenido ${this.userService.getNameAccount()}`, 'text-bg-success'
        );
        return;
      }

      // Error en bd
      this.showToastMessage(
        this.authService.message() ?? 'Error en acceso.',
        'text-bg-danger'
      );
    });
  }

}
