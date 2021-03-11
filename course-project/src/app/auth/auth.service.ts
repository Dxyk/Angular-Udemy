import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FirebaseConfigs } from '../constants/firebase-configs';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';
import { User } from './user.model';

export interface AuthResponseData {
  kind?: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private localStorageUserDataKey = 'userData';

  private tokenExpirationTimer: any;

  // user = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(FirebaseConfigs.SIGN_UP_URL, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((response: AuthResponseData) => {
          this.handleAuthenticationResponse(
            response.email,
            response.localId,
            response.idToken,
            +response.expiresIn
          );
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(FirebaseConfigs.SIGN_IN_URL, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((response: AuthResponseData) => {
          this.handleAuthenticationResponse(
            response.email,
            response.localId,
            response.idToken,
            +response.expiresIn
          );
        })
      );
  }

  autoLogin(): void {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem(this.localStorageUserDataKey));
    if (!userData) {
      return;
    } else {
      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );

      if (loadedUser.token) {
        // this.user.next(loadedUser);
        this.store.dispatch(
          new AuthActions.AuthenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
          })
        );
        const expirationDuration =
          new Date(userData._tokenExpirationDate).getTime() -
          new Date().getTime();
        this.autoLogout(expirationDuration);
      }
    }
  }

  logout(): void {
    // this.user.next(null);
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigate(['/auth']);
    localStorage.removeItem(this.localStorageUserDataKey);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number): void {
    console.log('The token will expire in ' + expirationDuration);

    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthenticationResponse(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ): void {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    // this.user.next(user);
    this.store.dispatch(
      new AuthActions.AuthenticateSuccess({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate,
      })
    );
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem(this.localStorageUserDataKey, JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse): Observable<string> {
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
    return throwError(errorMessage);
  }
}
