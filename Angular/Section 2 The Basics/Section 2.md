# Section 2 The Basics

## Lesson 14 - How an Angular app gets Loaded and Started

### Complete Overview

1. App starts up, loads `index.html`, and the scripts in it loads Angular.
2. Angular reads bootstrapped modules (`AppModule`) defined in `src/app/app.module.ts`
3. `AppModule` declares `AppComponent` to let Angular be aware of it on app startup
4. `app.component.ts` declares `app-root` component, and `app.component.html` uses it.

### How index.html is generated

Only `src/index.html` is served by the server.
Within it, the `<app-root></app-root>` is a root **component**.

In `app.component.ts`'s `@Component`, the `selector` property has value of `app-root`. This property specifies the custom component.

``` ts
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
```

On app startup, the custom component gets substituted by whatever was generated in the corresponding `.component.html`

### How Angular is triggered on startup

1. Whenever `ng serve` rebuilds our project, Angular CLI generates script files that imports Angular.

2. On startup, these script files are first executed before rendering. Note that these script files will execute `src/main.ts`.

3. Within the `main.ts` file, the code block bellow bootstraps `AppModule`, which is defined in `src/app/app.module.ts`.

    ``` ts
    import { AppModule } from './app/app.module';

    platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
    ```

4. In `app.module.ts`, the `bootstrap` array in `@NgModule` lists all the **components** that should be known to Angular when it analyzes the HTML file.

    ``` ts
    @NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
    })
    ```

## Lesson 15 - Components

Once Angular recognize it should start with the `app-root` component, we can build more components nested within `app-root`.

Each component should contain its own template and business logic. It allows splitting up complex logic into smaller / simpler parts that are reusable.

## Lesson 16 - Creating Components

The following lessons will be targeted to build the following:

> Build a component that reports server stats / condition

1. `mkdir src/app/server`. All components should live under `/src/app`
2. Create and Export a TS class for the component
3. User `@Component` **decorator** to declare it as a component.
   1. Decorator is a TS feature that enhances the class.
4. Add `selector` property. This tells Angular the HTML tag the template should use to be able to use this component.
   1. Typically the selector should have value of `'app-<component name>'`
   2. The selector names are unique across the application
5. Add `templateUrl`. This is the template of the HTML code for the component.
   1. The url could be a relative path, so `./<component>.component.html`

In `app/server/server.component.ts`,

``` ts
import { Component } from '@angular/core';

@Component({
    selector: 'app-server',
    templateUrl: './server.component.html'
})
export class ServerComponent {
}
```

In `app/server/server.component.html`

``` ts
<p>The server component</p>
```

## Lesson 17 - AppModule and Component Declaration

Angular uses components to build webpages, and uses **modules** to make them into bundles of functionalities. Angular will not know the component exists unless we register them in the NgModule.

A module is an exported class with decorators.

- declarations - the _registered_ components
- imports - other modules to import into the current one
- providers
- bootstrap - the components that Angular should be aware of when app starts

``` ts
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Lesson 18 - Using Custom Components

After registering the new component in the module, we can use the tag specified in the `selector` of the component.

In `app.component.html`,

``` html
<h3>I'm in the AppComponent!</h3>
<hr>
<app-server></app-server>
```

## Lesson 19 - Creating Components through the CLI and Nesting Components

`ng generate component <component name>` == `ng g c <component name>` - will generate declarations in AppComponent and the bundle of 4 files (`.component.ts`, `.component.spec.ts`, `.component.html`, `.component.css`)

Within servers.component.html, we can nest multiple other components (`server`s).

``` html
<app-server></app-server>
<app-server></app-server>
```

## Lesson 20 - Component Templates

Component template code can be added inline instead of using `*.component.html` by changing `templateUrl` to `template`.

Note if we add template inline using `'`, we cannot wrap the code with new line. To add multiple lines, use `` ` ``.

in `servers.component.ts`,

``` ts
@Component({
  selector: 'app-servers',
  template: `
    <app-server></app-server>
    <app-server></app-server>
  `,
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
```

## Lesson 21 - Component Styles

To add styles, we have

Option 1: use external styling packages in the template.

In `app.component.html`,

``` html
<div class="container">
  <div class="row">
    <div class="col-xs-12">
      <h3>I'm in the AppComponent!</h3>
      <hr>
      <app-servers></app-servers>
    </div>
  </div>
</div>
```

Option 2: add styling in the `*.component.css`, and reference this file in `styleUrls` in `*.component.ts`

In `app.component.css`

``` css
h3 {
    color: darkblue
}
```

Option 3: add styling in `*.component.ts` inline, using the `styles` property that takes in a list of styles in string (use `` ` ``).

In `app.component.ts`.

``` ts
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // styleUrls: ['./app.component.css']
  styles: [`
    h3 {
      color: dodgerblue;
    }
  `]
})
export class AppComponent {
}
```

## Lesson 22 - Component Selector

Selectors must have unique values

In components, it is possible to select by **attribute** (as in css). This will apply to all tags that contain the attribute defined in the selector. User `[]` to encompass the selector element.

In `servers.component.ts`,

``` ts
@Component({
  selector: '[app-servers]',
  template: `
    <app-server></app-server>
    <app-server></app-server>
  `,
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
```

In `app.component.html`,

``` html
<div class="container">
  <div class="row">
    <div class="col-xs-12">
      <h3>I'm in the AppComponent!</h3>
      <hr>
      <div app-servers></div>
    </div>
  </div>
</div>
```

It is also possible to select by **class** (as in css). This will apply to all tags that contain the class defined in the selector. User `.` to prepend the selector class.

In `servers.component.ts`,

``` ts
@Component({
  selector: '.app-servers',
  template: `
    <app-server></app-server>
    <app-server></app-server>
  `,
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
```

In `app.component.html`,

``` html
<div class="container">
  <div class="row">
    <div class="col-xs-12">
      <h3>I'm in the AppComponent!</h3>
      <hr>
      <div class="app-servers"></div>
    </div>
  </div>
</div>
```

Note that Angular does not support select by id.

## Assignment 1

1. Create two new Components (manually or with CLI): WarningAlert and SuccessAlert
2. Output them beneath each other in the AppComponent
3. Output a warning or success message in the Components
4. Style the Components appropriately (maybe some red/ green text?)

See `./assignment-1/`.

## Lesson 23 Assignment Solution

See `./assignment-1/`.

## Lesson 24 Databinding

**Databinding** is the communication between the typescript code and the HTML template. E.g. use TS to fetch data and communicate that data to the HTML template

Output data: TS to HTML

- String Interpolation

  ``` ts
  {{ data }}
  ```

- Property Binding

  ``` ts
  [property]="data"
  ```

Input data / User Event: HTML to TS

- Event Binding

  ``` ts
  (event)="expression"
  ```

**Two-Way-Binding**: Combining property binding and event binding

``` ts
([ngModel])="data"
```

## Lesson 25 String Interpolation

For HTML to reference string expressions defined in TS. Could be a string, property or a method that returns a string.

Restrictions:

- Can only reference string or resolved strings
- Can use ternary expressions
- Cannot write multi-line string
- Cannot have complex logic such as if/else blocks

In `server.component.ts`,

``` ts
import { Component } from '@angular/core';

@Component({
    selector: 'app-server',
    templateUrl: './server.component.html'
})
export class ServerComponent {
    serverId = 10;
    serverIsUp = true;
    serverStatusOnline = 'online';
    serverStatusOffline = 'offline';

    getServer() {
        return 'Server';
    }
}
```

In `server.component.html`,

``` html
<p>The {{ 'server' }} {{ getServer() }} with Id {{ serverId }} is of status {{ serverIsUp ? serverStatusOnline : serverStatus }}.</p>
```

## Lesson 26 Property Binding

It is possible to bind DOM native properties (`disabled` in this case), directives and Angular components to Angular properties as long as the types match up.

In `servers.component.ts`

``` ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {

  allowNewServer = false;

  constructor() {
    setTimeout(() => {
      this.allowNewServer = true;
    }, 2000);
  }

  ngOnInit(): void {
  }

}
```

In `servers.component.html`

``` html
<button class="btn btn-primary"
  [disabled]="!allowNewServer">Add Server</button>
```

## Lesson 27 String Interpolation vs Property Binding

Use String Interpolation when trying to display text, and use Property Binding when trying to change DOM property or directives.

Never mix string interpolation with property binding.

## Lesson 28 Event Binding

It is possible to bind DOM native events (`click` in this case) and Angular events to Angular methods.

In `servers.component.ts`

``` ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {

  serverCreationStatus = 'There are no servers created';

  constructor() {
  }

  ngOnInit(): void {
  }

  onCreateServer(): void {
    this.serverCreationStatus = 'A server has been created';
  }

}
```

In `servers.component.html`

``` html
<button class="btn btn-primary"
  (click)="onCreateServer()">Add Server</button>
<p>{{ serverCreationStatus }}</p>
```

## Lesson 29 Bindable Properties and Events

Search in MDN (Mozilla Developer Network) for a list of properties and events.

## Lesson 30 Passing and Using Data with Event Binding

When using event binding, the reserved variable `$event` can be passed into the method in the quotation marks. This variable denotes the data emitted with that event. For `<input (input)="method($event)">`, `$event` represents data from the user input event, and we can use `$event.target.value` to extract the data in the input tag.

TypeScript casting - use `<Class>var` to cast the variable `var` as class `Class`.

In `servers.component.ts`

``` ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {
  serverName = '';

  onUpdateServerName(event: any): void {
    this.serverName = (<HTMLInputElement>event.target).value;
  }
}
```

In `servers.component.html`

``` html
<label for="serverNameInput">Server Name</label>
<input type="text"
       class="form-control"
       id="serverNameInput"
       (input)="onUpdateServerName($event)">
<p>{{ serverName }}</p>
```
