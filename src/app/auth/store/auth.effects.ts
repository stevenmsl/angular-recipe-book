import { Actions, ofType, Effect } from '@ngrx/effects';
import * as aa from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthGuard } from '../auth.guard';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

/*
   


*/

export interface AuthResponseData {
  kind: string; // Got removed from the doc but it’s still there
  idToken: string; // A Firebase Auth ID token for the newly created user.
  email: string; //	The email for the newly created user.
  refreshToken: string; // A Firebase Auth refresh token for the newly created user.
  expiresIn: string; //The number of seconds in which the ID token expires.
  localId: string; // The uid of the newly created user.
  registered?: boolean;
}

const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));

  return new aa.AuthenticateSuccess({
    email,
    userId,
    token,
    expirationDate,
  });
};

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new aa.AuthenticateFail(errorMessage));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct';
      break;
  }
  return of(new aa.AuthenticateFail(errorMessage));
};

// allows Actions and HttpClient to be injected into AuthEffects
@Injectable()
export class AuthEffects {
  private apiKey = environment.firebaseAPIKey; //  'AIzaSyCEYPM8hH6Q1H_JMZkTQd0j0qGPLx4UAT0';
  private signupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;
  private signinUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;

  @Effect()
  /* 
    - this observable can not be completed in 
      any case even if there is error making 
      http calls.
    - it should return an observable of a 
      certain action - always.  
    - ngEffects will then dispatch that action  
  */
  authLogin = this.actions$.pipe(
    // filtered by action type to indicate
    // which action will trigger this side effect
    ofType(aa.LOGIN_START),
    switchMap((authData: aa.LoginStart) => {
      return this.http
        .post<AuthResponseData>(this.signinUrl, {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true,
        })
        .pipe(
          tap((resData) => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            // force it to expire much quicker – for testing purpose
            // this.authService.setLogoutTimer(+resData.expiresIn);
          }),
          /*
            - the map operator must appear before catchError operator
              in the pipe
            - this is because catchError cannot just terminate the 
              entire observable and instead must return an action 
              observable then later can be dispatched
            - if map operator appears after catchError it will be 
              executed too even in the case of login failure    
          */
          map((resData: AuthResponseData) =>
            handleAuthentication(
              +resData.expiresIn,
              resData.email,
              resData.localId,
              resData.idToken
            )
          ),
          catchError((errorRes) => handleError(errorRes))
        );
    })
  );

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(aa.SIGNUP_START),
    switchMap((signUpAction: aa.SignupStart) => {
      return this.http
        .post<AuthResponseData>(this.signupUrl, {
          email: signUpAction.payload.email,
          password: signUpAction.payload.password,
          returnSecureToken: true,
        })
        .pipe(
          tap((resData) => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map((resData: AuthResponseData) =>
            handleAuthentication(
              +resData.expiresIn,
              resData.email,
              resData.localId,
              resData.idToken
            )
          ),
          catchError((errorRes) => handleError(errorRes))
        );
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(aa.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem('userData'));

      if (!userData) {
        return { type: 'NO_ACTION' };
      }

      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );
      // make sure there is a valid token
      if (loadedUser.token) {
        //this.user.next(loadedUser);
        const expirationDuration =
          new Date(userData._tokenExpirationDate).getTime() -
          new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new aa.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate),
        });
      }

      return { type: 'NO_ACTION' };
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(aa.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  // you don’t want any action to be dispatched
  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(aa.AUTHENTICATE_SUCCESS),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  // naming conventions: add a trailing “$” sign
  // when naming observables.
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
