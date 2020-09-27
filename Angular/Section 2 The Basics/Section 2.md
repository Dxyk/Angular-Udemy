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
