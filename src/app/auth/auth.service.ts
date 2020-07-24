import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
import * as aa from './store/auth.actions';

export interface AuthResponseData {
  kind: string; // Got removed from the doc but it’s still there
  idToken: string; // A Firebase Auth ID token for the newly created user.
  email: string; //	The email for the newly created user.
  refreshToken: string; // A Firebase Auth refresh token for the newly created user.
  expiresIn: string; //The number of seconds in which the ID token expires.
  localId: string; // The uid of the newly created user.
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiKey = environment.firebaseAPIKey; //  'AIzaSyCEYPM8hH6Q1H_JMZkTQd0j0qGPLx4UAT0';
  private signupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;
  private signinUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;

  /*
    - for reactive UI to hide/show certain elements
      based on the status of authentication
    - BehaviorSubject: requires an initial value 
      and emits the current value to new subscribers
    - use behavior subject instead of subject so you can 
      have access to the current value (user object) 
      as a new subscriber.
    - This is useful because sometimes you do not want to subscribe 
      to this subject to access the user object right after 
      the user has successfully logged on. You want to access the 
      user object at a later time, for example to access secure data (recipes).            
  */
  //user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new aa.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  // signup(email: string, password: string) {
  //   return this.http
  //     .post<AuthResponseData>(this.signupUrl, {
  //       email,
  //       password,
  //       returnSecureToken: true,
  //     })
  //     .pipe(
  //       // put the error handling logic here instead of the Auth component
  //       // as the logic has nothing to do with the UI.
  //       catchError(this.handleError),
  //       tap((resData: AuthResponseData) => {
  //         this.handleAuthentication(
  //           resData.email,
  //           resData.localId,
  //           resData.idToken,
  //           +resData.expiresIn
  //         );
  //       })
  //     );
  // }

  // login(email: string, password: string) {
  //   return this.http
  //     .post<AuthResponseData>(this.signinUrl, {
  //       email,
  //       password,
  //       returnSecureToken: true,
  //     })
  //     .pipe(
  //       catchError(this.handleError),
  //       tap((resData: AuthResponseData) => {
  //         this.handleAuthentication(
  //           resData.email,
  //           resData.localId,
  //           resData.idToken,
  //           +resData.expiresIn
  //         );
  //       })
  //     );
  // }

  // logout() {
  //   // this.user.next(null);
  //   this.store.dispatch(new aa.Logout());
  //   //this.router.navigate(['/auth']);
  //   localStorage.removeItem('userData');
  //   if (this.tokenExpirationTimer) {
  //     clearTimeout(this.tokenExpirationTimer);
  //   }
  //   this.tokenExpirationTimer = null;
  // }

  // autoLogin() {
  //   const userData: {
  //     email: string;
  //     id: string;
  //     _token: string;
  //     _tokenExpirationDate: string;
  //   } = JSON.parse(localStorage.getItem('userData'));
  //   if (!userData) {
  //     return;
  //   }

  //   const loadedUser = new User(
  //     userData.email,
  //     userData.id,
  //     userData._token,
  //     new Date(userData._tokenExpirationDate)
  //   );

  //   // make sure there is a valid token
  //   if (loadedUser.token) {
  //     //this.user.next(loadedUser);
  //     this.store.dispatch(
  //       new aa.AuthenticateSuccess({
  //         email: loadedUser.email,
  //         userId: loadedUser.id,
  //         token: loadedUser.token,
  //         expirationDate: new Date(userData._tokenExpirationDate),
  //       })
  //     );

  //     const expirationDuration =
  //       new Date(userData._tokenExpirationDate).getTime() -
  //       new Date().getTime();
  //     this.autoLogout(expirationDuration);
  //   }
  // }

  // private handleError(errorRes: HttpErrorResponse) {
  //   let errorMessage = 'An unknown error occurred!';
  //   if (!errorRes.error || !errorRes.error.error) {
  //     return throwError(errorMessage);
  //   }
  //   switch (errorRes.error.error.message) {
  //     case 'EMAIL_EXISTS':
  //       errorMessage = 'This email exists already';
  //       break;
  //     case 'EMAIL_NOT_FOUND':
  //       errorMessage = 'This email does not exist';
  //       break;
  //     case 'INVALID_PASSWORD':
  //       errorMessage = 'This password is not correct';
  //       break;
  //   }
  //   return throwError(errorMessage);
  // }

  // private handleAuthentication(
  //   email: string,
  //   userId: string,
  //   token: string,
  //   expiresIn: number
  // ) {
  //   const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  //   const user = new User(email, userId, token, expirationDate);
  //   //this.user.next(user); // notify subscribers
  //   this.store.dispatch(
  //     new aa.AuthenticateSuccess({ email, userId, token, expirationDate })
  //   );
  //   this.autoLogout(expiresIn * 1000);
  //   localStorage.setItem('userData', JSON.stringify(user));
  // }
}
