# Section 21 Dynamic Components

## Dynamic Components

### Lesson 309 - Module Introduction

**Dynamic Components** are components that are created dynamically at runtime. Some example usages are Error dialogs, Loading overlays, etc.

### Lesson 310 - Adding an Alert Modal Component

Goal: Build an alert component (not dynamic yet) that appears in the Auth page when the login fails.

Create the `AlertComponent` through `ng g c shared/alert`

In `alert.component.ts`

- Take the error message as input

```ts
@Component({ ... })
export class AlertComponent implements OnInit {
  @Input()
  message: string;
}
```

In `alert.component.html`

- Build an error box
  - Display the error message
  - Have a close button (that does nothing for now)

```html
<div class="backdrop"></div>
<div class="alert-box">
  <p>{{ message }}</p>
  <div class="alert-box-actions">
    <button class="btn btn-primary">Close</button>
  </div>
</div>
```

In `auth.component.html`

- Load the `AlertComponent` if there is an error, and pass in the error message

```html
<app-alert [message]="error" *ngIf="error"></app-alert>
```

### Lesson 311 - Understanding the Different Approaches

Dynamic components are components that are loaded programmatically. There are 2 ways of doing so.

1. Load the component using `*ngIf`

   - This is a **Declarative Approach** since the component is added to the template using its selector
   - The `*ngIf` controls whether the component should be loaded to the DOM
   - Pros
     - Easy to use
   - Cons
     - None

2. **Dynamic Component Loader**

   - This is a util feature that is deprecated, but still worth learning the concept
   - This is a **Imperative Approach** since the component is created and added to DOM via code
   - The component is managed and added by developer. Everything `*ngIf` does needs to be managed by code in the component loader.
   - Pros
     - More flexibility compared to using `*ngIf`
     - No need to modify the template
   - Cons
     - Deprecated and should no longer be used

### Lesson 312 - Using ngIf

To make the alert dialog with `*ngIf` fully functional

In `alert.component.ts`

```ts
@Component({ ... })
export class AlertComponent implements OnInit {
  ...
  @Output()
  closeAlert = new EventEmitter<void>();

  onClose(): void {
    this.closeAlert.emit();
  }
}
```

In `alert.component.html`

```html
<div class="backdrop" (click)="onClose()"></div>

<div class="alert-box">
  <p>{{ message }}</p>
  <div class="alert-box-actions">
    <button class="btn btn-primary" (click)="onClose()">Close</button>
  </div>
</div>
```

In `auth.component.ts`

```ts
@Component({ ... })
export class AuthComponent implements OnInit {
  onAlertClosed(): void {
    this.error = null;
  }
}
```

In `auth.component.html`

```html
<app-alert
  [message]="error"
  (closeAlert)="onAlertClosed()"
  *ngIf="error"
></app-alert>
```

### Lesson 313 - Preparing Programmatic Creation

Goal: Show the alert programmatically using code (not using the selector in the HTML template).

In `auth.component.ts`

- Create the `AlertComponent` in a `showErrorAlert()` method
- Call the `showErrorAlert()` method when the login/sign-up requests fail
- To create the `AlertComponent`
  - Use the `ComponentFactoryResolver` provided by Angular to get the alert component factory
  - To tell Angular where/how to instantiate the component in the DOM, use `ViewPointRef`

```ts
@Component({ ... })
export class AuthComponent implements OnInit {
  onSubmit(authForm: NgForm): void {
    authObservable.subscribe(
      ...,
      (errorMessage: string) => {
        ...;
        this.showErrorAlert(errorMessage);
      }
    );
  }

  private showErrorAlert(errorMessage: string): void {
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );
  }
}
```

Create a `PlaceholderDirective` using the cli `ng generate directive shared/placeholder/placeholder`

In `placeholder.directive.ts`

- Inject the `ViewContainerRef` class and make it public, so it can be accessed in `AuthComponent` to create the `AlertComponent`

```ts
@Directive({
  selector: '[appPlaceholder]',
})
export class PlaceholderDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
```

### Lesson 314 - Creating a Component Programmatically

In `auth.component.html`

- Use `ng-template` to place a reference in the template
- Add the `appPlaceholder` directive to mark the template

```html
<ng-template appPlaceholder></ng-template>
```

In `auth.component.ts`

- Use `@ViewChild(PlaceholderDirective)` to get access to the first component that contains the `PlaceholderDirective`
- Use `PlaceholderDirective.ViewContainerRef` to
  - Clear the content that may initially be there
  - Create the `AlertComponent` using the `alertComponentFactory`

```ts
@Component({ ... })
export class AuthComponent implements OnInit {
  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;

  private showErrorAlert(errorMessage: string): void {
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    hostViewContainerRef.createComponent(alertComponentFactory);
  }
}
```
