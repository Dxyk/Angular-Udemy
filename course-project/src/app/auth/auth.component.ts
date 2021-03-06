import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import * as fromApp from '../store/app.reducer';
import { AuthService } from './auth.service';
import * as AuthActions from './store/auth.actions';
import * as fromAuth from './store/auth.reducer';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  private closeAlertSubscription: Subscription;

  private storeSubscription: Subscription;

  isLoginMode = true;

  isLoading = false;

  error: string = null;

  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.storeSubscription = this.store
      .select('auth')
      .subscribe((authState: fromAuth.State) => {
        this.isLoading = authState.loading;
        this.error = authState.authError;
      });
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm): void {
    if (!authForm.valid) {
      return;
    } else {
      const email = authForm.value.email;
      const password = authForm.value.password;

      // let authObservable: Observable<AuthResponseData>;

      // this.isLoading = true;

      if (this.isLoginMode) {
        // authObservable = this.authService.login(email, password);
        this.store.dispatch(
          new AuthActions.LoginStart({ email: email, password: password })
        );
      } else {
        // authObservable = this.authService.signUp(email, password);
        this.store.dispatch(
          new AuthActions.SignUpStart({ email: email, password: password })
        );
      }

      // authObservable.subscribe(
      //   (responseData: AuthResponseData) => {
      //     console.log(responseData);
      //     this.isLoading = false;
      //     this.router.navigate(['/recipes']);
      //   },
      //   (errorMessage: string) => {
      //     console.log(errorMessage);
      //     this.error = errorMessage;
      //     // this.showErrorAlert(errorMessage);
      //     this.isLoading = false;
      //   }
      // );

      authForm.reset();
    }
  }

  onAlertClosed(): void {
    // this.error = null;
    this.store.dispatch(new AuthActions.ClearError());
  }

  ngOnDestroy(): void {
    if (this.closeAlertSubscription) {
      this.closeAlertSubscription.unsubscribe();
    }
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
  }

  // private showErrorAlert(errorMessage: string): void {
  //   // This is valid TS code, but not valid Angular code,
  //   // and the AlertComponent will not be instantiated correctly
  //   // const alertComponent = new AlertComponent();
  //   // To create a component programmatically,
  //   // Angular needs to wire it up using ComponentFactory.
  //   const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
  //     AlertComponent
  //   );
  //   // To tell Angular where to add the component in the DOM, use ViewPointerRef.
  //   const hostViewContainerRef = this.alertHost.viewContainerRef;
  //   hostViewContainerRef.clear();

  //   const componentRef = hostViewContainerRef.createComponent(
  //     alertComponentFactory
  //   );

  //   componentRef.instance.message = errorMessage;
  //   this.closeAlertSubscription = componentRef.instance.closeAlert.subscribe(
  //     () => {
  //       this.closeAlertSubscription.unsubscribe();
  //       hostViewContainerRef.clear();
  //     }
  //   );
  // }
}
