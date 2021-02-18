import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export class AuthInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('Sending Request');
    const modifiedReq = req.clone({
      headers: req.headers.append('Auth', 'authKey'),
    });
    return next.handle(modifiedReq);
  }
}
