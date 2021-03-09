import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
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
          catchError((error) => {
            // ...
            // returns a non-error observable to keep the observable alive
            of();
          }),
          map((responseData) => {
            of();
          })
        );
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
