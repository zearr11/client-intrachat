import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../../views/auth/services/auth.service";
import { environment } from "../../../environments/environment";
import { catchError, throwError } from "rxjs";
import { Router } from "@angular/router";
import { ToastMessageService } from "../services/toast-message.service";

const endpointLogin = environment.baseUrl+`/auth`

export function tokenInterceptor(req: HttpRequest<unknown>,next: HttpHandlerFn) {

  const router = inject(Router);
  const authService = inject(AuthService);
  const toastService = inject(ToastMessageService);

  if (req.url === endpointLogin) {
    return next(req);
  }

  const token = authService.accessToken();

  const newReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        authService.logout();
        router.navigateByUrl('/login');
        toastService.show(
          'Inicie sesión nuevamente, por favor.', 'text-bg-secondary'
        );
      }
      return throwError(() => error);
    })
  );

}
