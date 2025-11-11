import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../../admin/services/user.service';
declare var bootstrap: any;

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {

  fb = inject(FormBuilder);
  hasError = signal(false);
  messageError = signal<string|null>(null);
  router = inject(Router)

  authService = inject(AuthService);
  userService = inject(UserService);

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

    this.authService.login(email!, password!).subscribe((isAuthenticated) => {
      if (isAuthenticated) {

        if (this.authService.roleUser() === 'ROLE_ADMIN') {
          this.router.navigateByUrl('/dashboard');
        }
        else {
          this.router.navigateByUrl('/');
        }

        return;
      }

      this.hasError.set(true);
      this.messageError.set(this.authService.messageError());
      setTimeout(() => {
        this.hasError.set(false);
        this.messageError.set(null);
      }, 3000);
    });
  }

}
