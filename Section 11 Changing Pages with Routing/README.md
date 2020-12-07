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

### Lesson 127 - Navigating with Router Links

Goal: make links in `app.component.html` functional.

The first intuition would be to modify the value of `<a href="">` attribute. However, this is not the desired behavior because each time we click the link, it sends the request to the server, and the server returns our app page. This restarts the application entirely, and causes the application to lose the state, which is not what we want.

Instead of using `href`, use `routerLink`. This is an Angular property that intercepts the click event and processes the path. If the path is registered, it will load the registered component instead of reloading the application. If the path is not registered, it will throw an error.

In `app.component.html`

- `routerLink` can be used in 2 ways
  - Property value assignment (`<a routerLink="/">`) takes in the path as a string
  - Property binding (`<a [routerLink]="['/path1', 'path2']">`). It takes in a list of paths that will be concatenated together. E.g. `/path1/path2`.

```html
<ul class="nav nav-tabs">
  <li role="presentation" class="active">
    <a routerLink="/">Home</a>
  </li>
  <li role="presentation">
    <a routerLink="/servers">Servers</a>
  </li>
  <li role="presentation">
    <a [routerLink]="['/users']">Users</a>
  </li>
</ul>
```

### Lesson 128 - Understanding Navigation Paths

In `<a routerLink>`, the paths can either be absolute (`/servers`) or relative (`servers`).

- When using the absolute path, no matter the current path, Angular Router always goes to the specified router link (`/servers` -> `localhost:4200/servers`).
- When using the relative path, angular appends the specified router link to the current path. The current path depends on which component the user is currently on (currently on the ServersComponent and specify `/servers` -> `localhost:4200/servers/servers`)

Relative paths allow unix-like navigations. E.g. `./path`, `../path`, etc
