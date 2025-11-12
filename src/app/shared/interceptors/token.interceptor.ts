import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../../entity/user/services/auth.service";
import { environment } from "../../../environments/environment";

const endpointLogin = environment.baseUrl+`/auth`

export function tokenInterceptor(req: HttpRequest<unknown>,next: HttpHandlerFn) {

  if (endpointLogin === req.url) {
    return next(req);
  }

  const token = inject(AuthService).accessToken();
  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });

  return next(newReq);

}
