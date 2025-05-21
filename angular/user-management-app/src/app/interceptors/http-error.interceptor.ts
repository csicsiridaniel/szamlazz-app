import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {map, Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.body?.error) {

        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ismeretlen hiba történt!';

        if (error.status === 400 && error.error?.errors) {
          const validationErrors = error.error.errors;

          const messages = validationErrors.map((err: any) => {
            return `${err.field}: ${err.defaultMessage}`;
          });

          errorMessage = messages.join('\n');
        } else if (error.error instanceof ErrorEvent) {
          errorMessage = `Hiba: ${error.error.message}`;
        } else {
          errorMessage = `Hiba (${error.status}): ${error.message}`;
        }

        alert(errorMessage);

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
