import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

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
          this.showErrorAlert(errorMessage);
          this.isLoading = false;
        }
      );

      authForm.reset();
    }
  }

  onAlertClosed(): void {
    this.error = null;
  }

  private showErrorAlert(errorMessage: string): void {
    // This is valid TS code, but not valid Angular code,
    // and the AlertComponent will not be instantiated correctly
    // const alertComponent = new AlertComponent();
    // To create a component programmatically,
    // Angular needs to wire it up using ComponentFactory.
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );
    // To tell Angular where to add the component in the DOM, use ViewPointerRef.
    // TODO - Lesson 314
  }
}
