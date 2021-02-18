import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LoggingInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('Outgoing Request to: ' + req.url);

    return next.handle(req).pipe(
      tap((event: HttpEvent<object>) => {
        if (event.type === HttpEventType.Response) {
          console.log('Incoming Response. Body:');
          console.log(event.body);
        }
      })
    );
  }
}
