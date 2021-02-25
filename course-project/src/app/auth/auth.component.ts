import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;

  isLoading = false;

  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm): void {
    if (!authForm.valid) {
      return;
    } else {
      const email = authForm.value.email;
      const password = authForm.value.password;

      let authObservable: Observable<AuthResponseData>;

      this.isLoading = true;

      if (this.isLoginMode) {
        authObservable = this.authService.login(email, password);
      } else {
        authObservable = this.authService.signUp(email, password);
      }

      authObservable.subscribe(
        (responseData: AuthResponseData) => {
          console.log(responseData);
          this.isLoading = false;
          this.router.navigate(['/recipes']);
        },
        (errorMessage: string) => {
          console.log(errorMessage);
          this.error = errorMessage;
          this.isLoading = false;
        }
      );

      authForm.reset();
    }
  }
}
