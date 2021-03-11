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

@Injectable()
export class AuthEffects {
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
            const expirationDate = new Date(
              new Date().getTime() + +responseData.expiresIn * 1000
            );
            return new AuthActions.LoginSuccess({
              email: responseData.email,
              userId: responseData.localId,
              token: responseData.idToken,
              expirationDate: expirationDate,
            });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
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
            return of(new AuthActions.LoginFail(errorMessage));
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN_SUCCESS),
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
