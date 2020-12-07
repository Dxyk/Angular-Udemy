# Section 11 - Changing Pages with Routing

## Routing

### Lesson 123 - Module Introduction

Angular provides a router that allows dividing the app into multiple segments that is accessible by different urls. The app will still be single-paged, but across different urls, the major parts / components of the app are changed.

### Lesson 124 - Why do we need a Router

A router is in charge of providing the corresponding part of the application when the user access a url within the app.

### Lesson 125 - Understanding the Example Project

### Lesson 126 - Setting up and Loading Routes

Goal: In `section11-app`, display only 1 component at a time base on which link is clicked in the the nav-bar. E.g. when accessing `/users`, load the users component and not the others.

In `app.module.ts`

1. Define a list of routes `Routes` that maps the `path` to the `component`
   1. E.g. `{ path: 'users', component: UsersComponent }` indicates that when the user accesses the path `/users` (e.g. `localhost:4200/users`), the router module will render the `UsersComponent` component.
2. Add `RouterModule.forRoot(appRoutes)` to the imports.
   1. Adding `RouterModule` to the imports tells Angular to add the routing functionality.
   2. `forRoot()` allows registering routes for the main application.

```ts
import { ... } from '...';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UsersComponent },
  { path: 'servers', component: ServersComponent },
];

@NgModule({
  declarations: [...],
  imports: [..., RouterModule.forRoot(appRoutes)],
  providers: [ServersService],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

In `app.component.html`

- `router-outlet` is an angular directive that marks the location where the router should load the component when accessing the paths.

```html
<div class="row">
  <div class="col-xs-12 col-sm-10 col-md-8 col-sm-offset-1 col-md-offset-2">
    <router-outlet></router-outlet>
  </div>
</div>
```
