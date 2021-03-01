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
