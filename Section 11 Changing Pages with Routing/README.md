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

### Lesson 129 - Styling Active Router Links

Goal: Change tab style on route change

The `routerLinkActive` allows adding / removing class to HTML elements. It analyzes the current path, and marks the element and its children in it as Active when the current path matches the link.

`[routerLinkActiveOptions]` allows configurations on how the router link should be matched.

- `exact: false` (default) indicates that `routerLinkActive` will be set to Active as long as the path **contains** the link value
- `exact: true` indicates that `routerLinkActive` will only be set to Active if the path is an **exact match** of the link value

In `app.component.html`

```html
<ul class="nav nav-tabs">
  <li
    role="presentation"
    routerLinkActive="active"
    [routerLinkActiveOptions]="{exact: true}"
  >
    <a routerLink="/">Home</a>
  </li>
  <li role="presentation" routerLinkActive="active">
    <a routerLink="/servers">Servers</a>
  </li>
  <li role="presentation" routerLinkActive="active">
    <a [routerLink]="['/users']">Users</a>
  </li>
</ul>
```

### Lesson 130 - Navigating Programmatically

Goal: navigate / change the route programmatically

In `home.component.ts`

Similar to the `[routerLinkActive]` directive, `Router.navigate()` takes in a list of paths that can be concatenated to the final path.

```ts
import { ... } from '...';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  onLoadServers() {
    // complex calculations
    this.router.navigate(['/servers']);
  }
}
```

In `home.component.html`

```html
<button class="btn btn-primary" (click)="onLoadServers()">Load Servers</button>
```

### Lesson 131 - Using Relative Paths in Programmatic Navigation

One difference between the `routerLink` property and the `Router.navigate()` method is that `routerLink` always know the current path the user is on, while `Router.navigate()` does not know the current path.

In `servers.component.ts`

1. `Router.navigate()` takes in an `NavigationExtras` object that has an attribute of `relativeTo`. This provides the router what the current route (path) is.
2. `ActivatedRoute` provides information on the route when the object is injected. In this case, it is initialized to whatever the route `ServersComponent` corresponds to.

```ts
import { ... } from '...';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css'],
})
export class ServersComponent implements OnInit {
  public servers: { id: number; name: string; status: string }[] = [];

  constructor(
    private serversService: ServersService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.servers = this.serversService.getServers();
  }

  onReload() {
    this.router.navigate(['.'], { relativeTo: this.route });
  }
}
```

In `servers.component.html`

```html
<button class="btn btn-primary" (click)="onReload()">Reload Page</button>
```

### Lesson 132 - Passing Parameters to Routes

To setup a dynamic path in the Router, pass the `path` as `/path1/:dynamicPath` (e.g. `/users/:id`). The `:` in the path tells Angular that it is the dynamic part of the path, and the dynamic part is retrievable as **route parameter**.

In `app.module.ts`

```ts
import { ... } from '...';

const appRoutes: Routes = [
  ...,
  { path: 'users/:id', component: UserComponent },
];

@NgModule({
  declarations: [...],
  imports: [..., RouterModule.forRoot(appRoutes)],
  providers: [ServersService],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Lesson 133 - Fetching Route Parameters

To obtain the dynamic data in the dynamic path,

In `user.component.ts`

1. Use `ActivatedRoute` to obtain the current route
   1. `ActivatedRoute.snapshot.params` contains a map of all the dynamic variables in the current route
   2. These dynamic variables are defined in Route's route param

```ts
import { ... } from '...';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  user: { id: number; name: string };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.user = {
      id: this.route.snapshot.params['id'],
      name: this.route.snapshot.params['name']
    };
  }
}
```

In `user.component.html`

```html
<p>User with ID {{ user.id }} loaded.</p>
<p>User name is {{ user.name }}</p>
```

### Lesson 134 - Fetching Route Parameters Reactively

Problem with using `ActivatedRoute.snapshot`: When the component is already initialized, the snapshot will not be updated. E.g. navigate to the component, navigate to a different route but still in the component, the component will not be updated because it uses the same snapshot.

To fetch route parameter in subsequent changes (after the component was initialized), use `ActivatedRoute.params`.

In `user.component.ts`

- `ActivatedRoute.params` is an **Observable**.
  - Observables are used to execute asynchronous tasks.
  - Fetching the route parameters is an async task because the component won't know if, when and how the route parameters are changed.
  - When an Observable fires, the callback subscribed to it will be executed.
  - A cookie cutter example of Observable is an Event. When an Event emits, the EventListener that listens to this event will execute its tasks.

```ts
import { ... } from '...';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  user: { id: number; name: string };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.user = {
      id: this.route.snapshot.params['id'],
      name: this.route.snapshot.params['name']
    };

    this.route.params.subscribe((params: Params) => {
      this.user = {
        id: params['id'],
        name: params['name'],
      };
    });
  }
}
```

In `user.component.html`

```html
<a [routerLink]="['/users', 10, 'Anna']">Load Anna</a>
```

### Lesson 135 - An Important Note about Route Observables

Angular automatically cleans up all subscriptions to observables shipped with Angular when a component is destroyed. This is because if Angular doesn't clean this up, when a component is destroyed, the subscription is left in the memory, and eventually this eats up all the RAM.

In `user.component.ts`, this is equivalent to the following

- It is not necessary to manually cleanup when subscribing to observables shipped with Angular.
- It is necessary to manually cleanup when subscribing to custom observables.

```ts
import { ... } from '...';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnDestroy {
  paramSubscription: Subscription;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    ...
    this.paramSubscription = this.route.params.subscribe((params: Params) => { ... });
  }

  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
  }
}
```

### Lesson 136 - Passing Query Parameters and Fragments

Goal: Pass and Retrieve query parameters and fragments in the url

**Query Parameters** are params in the url of form `/path?param1=value1&param2=value2`

**Fragments** are fragments of the html to jump to. In the url, `/path#jumpTo`

To set these params using the `routerLink` directive, we use its bindable properties

- `[queryParam]` takes in an object of `{ [queryParam]: [defaultValue] }`.
- `[fragment]` takes in a string that indicates

In `servers.component.html`

```html
<a
  [routerLink]="['/servers', 5, 'edit']"
  [queryParams]="{allowEdit: '1'}"
  [fragment]="'Loading'"
  href="#"
  class="list-group-item"
  *ngFor="let server of servers"
></a>
```

To set these params programmatically, use the `NavigationExtras` object in `Router.navigate(paths, NavigationExtras)`

In `home.component.ts`

```ts
import { ... } from '';

@Component({ ... })
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  onLoadServers(id: number) {
    this.router.navigate(['/servers', id, 'edit'], {
      queryParams: { allowEdit: '1' },
      fragment: 'Loading',
    });
  }
}
```

In `home.component.html`

```html
<button class="btn btn-primary" (click)="onLoadServers(1)">Load Servers</button>
```

### Lesson 137 - Retrieving Query Parameters and Fragments

To retrieve the query parameter and fragment, similar to route parameters, use `ActivatedRoute.snapshot.queryParams` and `ActivatedRoute.snapshot.fragment`.

Note that these are still snapshots and the values will not updated once the component is initialized. To make the component listen to the changes, subscribe to the observables `ActivatedRoute.queryParams` and `ActivatedRoute.fragments`.

In `edit-server.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class EditServerComponent implements OnInit {
  ...
  constructor(
    private serversService: ServersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log(this.route.snapshot.queryParams);
    console.log(this.route.snapshot.fragment);
    ...
  }

  ...
}
```

### Lesson 138 - Practicing and some Common Gotchas

Some notes so far:

- `[routerLink]` takes in a list. The list element can be string or expressions that can be converted to strings.
- When a component needs to be instantiated using routing params, be careful not to instantiate it in the template with missing properties
- `ActivatedRoute.snapshot.params` will return values of type string. Remember to convert them to the correct value types before referencing them.

### Lesson 139 - Setting up Child (Nested) Routes

Goal: Load the component inside a component instantiated through routing, using Child (Nested) Routes

In `app.module.ts`'s `Routes` list, it is possible to group multiple paths with the same parent. Each route in the group will inherit the parent's path, and Angular will consider them child routes of the parent route.

```ts
import { ... } from '...';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users',
    component: UsersComponent,
    children: [
      { path: ':id/:name', component: UserComponent }
    ],
  },
  {
    path: 'servers',
    component: ServersComponent,
    children: [
      { path: ':id', component: ServerComponent },
      { path: ':id/edit', component: EditServerComponent },
    ],
  },
];

@NgModule({ ... })
export class AppModule {}
```

The `router-outlet` directive is only responsible for loading the top-level route defined in the `Routes` list in `app.module.ts`. To render the next level, another `router-outlet` needs to be added in the rendered component's template.

In `users.component.html`, comment out the original app-user since it will gain its route params, query params and fragments from the child router.

```html
<!-- <app-user></app-user> -->
<router-outlet></router-outlet>
```

Similarly, in `servers.component.html`

```html
<router-outlet></router-outlet>
<!-- <button class="btn btn-primary" (click)="onReload()">Reload Page</button>
<app-edit-server></app-edit-server>
<hr>
<app-server></app-server> -->
```
