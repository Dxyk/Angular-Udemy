import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
    return next.handle(modifiedReq).pipe(
      tap((event: HttpEvent<object>) => {
        if (event.type === HttpEventType.Response) {
          console.log('Response arrived. Body Data:');
          console.log(event.body);
        }
      })
    );
  }
}
