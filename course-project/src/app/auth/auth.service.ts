import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FirebaseConfigs } from '../constants/firebase-configs';

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
  constructor(private http: HttpClient) {}

  signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(FirebaseConfigs.SIGN_UP_URL, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((error: any) => {
          let errorMessage = 'An unknown error occurred!';
          if (error?.error?.error) {
            switch (error.error.error.message) {
              case 'EMAIL_EXISTS': {
                errorMessage = 'This email already exists!';
              }
            }
          }
          return throwError(errorMessage);
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(FirebaseConfigs.SIGN_IN_URL, {
        email: email,
        password: password,
        returnSecureToken: true,
      });
  }
}
