import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;

  constructor(private authService: AuthService) {}

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

      if (this.isLoginMode) {
        // TODO
      } else {
        this.authService.signUp(email, password).subscribe(
          (responseData: AuthResponseData) => {
            console.log(responseData);
          },
          (error: any) => {
            console.log(error);
          }
        );
      }

      authForm.reset();
    }
  }
}
