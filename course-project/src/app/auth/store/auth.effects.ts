import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { FirebaseConfigs } from 'src/app/constants/firebase-configs';
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  kind?: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (
  email: string,
  userId: string,
  token: string,
  expiresIn: number
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
  });
};

const handleError = (errorResponse: HttpErrorResponse) => {
  let errorMessage = 'An unknown error occurred!';
  if (errorResponse?.error?.error) {
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS': {
        errorMessage = 'This email already exists!';
        break;
      }
      case 'EMAIL_NOT_FOUND': {
        errorMessage = 'This email does not exist!';
        break;
      }
      case 'INVALID_PASSWORD': {
        errorMessage = 'This password is incorrect!';
        break;
      }
    }
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  @Effect()
  authSignUp = this.actions$.pipe(
    ofType(AuthActions.SIGN_UP_START),
    switchMap((signUpAction: AuthActions.SignUpStart) => {
      return this.http
        .post<AuthResponseData>(FirebaseConfigs.SIGN_UP_URL, {
          email: signUpAction.payload.email,
          password: signUpAction.payload.password,
          returnSecureToken: true,
        })
        .pipe(
          map((responseData: AuthResponseData) => {
            return handleAuthentication(
              responseData.email,
              responseData.localId,
              responseData.idToken,
              +responseData.expiresIn
            );
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return handleError(errorResponse);
          })
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(FirebaseConfigs.SIGN_IN_URL, {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true,
        })
        .pipe(
          map((responseData: AuthResponseData) => {
            return handleAuthentication(
              responseData.email,
              responseData.localId,
              responseData.idToken,
              +responseData.expiresIn
            );
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return handleError(errorResponse);
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
