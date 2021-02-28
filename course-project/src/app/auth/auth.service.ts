import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FirebaseConfigs } from '../constants/firebase-configs';
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
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) {}

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

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
  }

  private handleAuthenticationResponse(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ): void {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
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
