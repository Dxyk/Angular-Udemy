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

``` typescript
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

    ``` typescript
    import { AppModule } from './app/app.module';

    platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
    ```

4. In `app.module.ts`, the `bootstrap` array in `@NgModule` lists all the **components** that should be known to Angular when it analyzes the HTML file.

    ``` typescript
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

In `app/server/server.component.ts`:

``` typescript
import { Component } from '@angular/core';

@Component({
    selector: 'app-server',
    templateUrl: './server.component.html'
})
export class ServerComponent {
}
```

In `app/server/server.component.html`

``` typescript
<p>The server component</p>
```
