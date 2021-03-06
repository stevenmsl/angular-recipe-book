import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      /* 
           - take: you need to take a snapshot of data at a particular point in time 
             but do not require further emissions.
           - in this case we only interested in accessing the current user object 
        */
      take(1),
      /*
           - exhaustMap: Projects each source value to an Observable which 
             is merged in the output Observable only if the previous projected 
             Observable has completed.
           - what this mean is we will wait until take(1) completed. 
             We then can have access to the user object and can return 
             a brand new, unrelated observable (give you the access to recipes) 
             all together. 
        */
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
