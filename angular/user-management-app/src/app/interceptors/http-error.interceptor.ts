// src/app/core/interceptors/http-error.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ismeretlen hiba történt!';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Hiba: ${error.error.message}`;
        } else {
          errorMessage = `Hiba (${error.status}): ${error.message}`;
        }

        //alert(errorMessage);

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
