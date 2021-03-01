import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  private closeAlertSubscription: Subscription;

  isLoginMode = true;

  isLoading = false;

  error: string = null;

  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;

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

  ngOnDestroy(): void {
    if (this.closeAlertSubscription) {
      this.closeAlertSubscription.unsubscribe();
    }
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
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(
      alertComponentFactory
    );

    componentRef.instance.message = errorMessage;
    this.closeAlertSubscription = componentRef.instance.closeAlert.subscribe(
      () => {
        this.closeAlertSubscription.unsubscribe();
        hostViewContainerRef.clear();
      }
    );
  }
}
