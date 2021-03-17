# Section 25 Angular Universal

## Angular Universal

### Lesson 389 - Module Introduction

**Angular Universal** allows the front-end app to pre-render on the server. When the user visits the page, the initial rendering is already done. Only subsequent actions are handled by the browser.

For normal Angular apps, all the rendering are done by the compiled JS file instead of the HTML file.

This could be disadvantageous because

- If the user has slower internet connection, the JS files will not download as quickly, and the rendering speed will be impacted.
- Search Engines use Crawlers to search for website contents. It usually only search for the initially downloaded webpage instead of waiting for all the scripts to load.

Angular Universal pre-loads the page, and thus returns a proper HTML page back from the server, which helps solve/mitigate the above issues. After the page is loaded, Angular takes over again and handles the subsequent actions.

### Lesson 390 - Angular Universal & ModuleMapLoader

In the next lecture, it is no longer required to add `ModuleMapLoader` to the `app.server.ts` file with Angular 9+.

### Lesson 391 - Adding Angular Universal

Use `ng add @nguniversal/express-engine --clientProject <projectName>` to add Angular Universal to the project. The `projectName` can be found under the `"projects"` property in `angular.json`.

This command will create and/or transform a few files in the project directory. The Angular app will still run as normal, but we now have the option to pre-render it in the server.

To allow pre-rendering, there are 2 files that need to be updated.

In `app.server.module.ts` (this is no longer required for Angular 9+)

- Import `ModuleMapLoaderModule`
  - This module enables lazy loading with Angular Universal
  - This can be installed using `npm install --save @nguniversal/module-map-ngfactory-loader`

```ts
@NgModule({
  imports: [
    AppModule,
    ServerModule,
    // ModuleMapLoaderModule,  // no longer required for Angular 9+
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
```

It is important to understand that the first page is loaded and rendered on the server. After this first page is returned to the browser, the Angular single-page application starts to run. This indicates that certain browser-only APIs are not available. One example is `localStorage`.

In `auth.effects.ts`, the `autoLogin` Effect extracts the user info from `localStorage`. This will fail on the server because `localStorage` is a browser-only API and it does not exist on the server.

In `app.component.ts`

- Inject the `platformId` using the `Inject` decorator provided by Angular
  - This is different than normal class injection
    - Class injection lets Angular look for or create the instance of the class and inject it into the component
    - `platformId` will be a hard-coded value, so class injection will not work in this case. Instead, we need to ask Angular to inject it using the `Inject` decorator
  - The `@Inject` decorator takes in the hard-coded value as input
    - In this case, `PLATFORM_ID` is the hard-coded platform identifier that indicates the platform the application is run on.
- Using `platformId`, make sure the `AutoLogin` Action is not dispatched if the application is rendered in the server
  - `@angular/common` provides the `platformBrowser()` method that takes in the platformId and returns `true` if the current platform is on the browser.

```ts
@Component({ ... })
export class AppComponent implements OnInit {
  constructor(
    private store: Store<fromApp.AppState>,
    private loggingService: LoggingService,
    @Inject(PLATFORM_ID) private platformId,
  ) {}

  ngOnInit(): void {
    if (platformBrowser(this.platformId)) {
      this.store.dispatch(new AuthActions.AutoLogin());
    }
    this.loggingService.printLog('Hello from AppComponent NgOnInit');
    console.log(environment.production);
  }
}
```

In `package.json`, Angular Universal will add a new `build:ssr` script. By running `npm run build:ssr`, NPM will build the Angular app in production mode, and then also create the Angular Universal server-side build.

To serve the Angular Universal server-side app, a NodeJS server is required. The static host we have been using will no longer work. In that NodeJS enabled server, use the `serve:ssr` script in `package.json` to serve the server-side app. When the request hits the server, the server will return the pre-rendered version of the application.

By viewing page source, compared to the purely script-driven non-pre-rendered version of the application, the pre-rendered version contain the actual HTML content of the first page.

Note

- The previous version of the application no longer works because of a dependency mismatch. To resolve this, upgrade the application to Angular 11 by following the steps specified in [Appendix - Update to Angular 11](#update-to-angular-11)

### Lesson 392 - Adding Angular Universal with NestJS

[NestJS](https://nestjs.com/) is a server-side framework for NodeJs.

To add NestJS Universal to the project, use `ng add @nestjs/ng-universal`.

The difference between NestJS Universal and Angular Universal is that the NestJS version not only supports pre-rendering, but also comes with a NestJS server application. This makes the application full-stack.

To build and serve the Universal application, use the same commands (NestJS generates them in the `package.json` file).

```sh
npm run build:ssr
npm run serve:ssr
```

### Lesson 393 - Deploying Universal Apps

The reason why Universal Apps cannot be deployed to a static host (Firebase Hosting, AWS S3, etc) is that the Universal Apps need to use NodeJS to pre-render on the server.

Some available servers that can host Universal Apps are Heroku or AWS ElasticBeanstalk.

To these hosts, upload the `dist/` folder along with the `package.json` file. On the web server, ensure that `npm install` is executed, followed by `npm serve:ssr`.

## Appendix

### Update to Angular 11

#### Step 1

- Update Angular CLI with `npm i -g @angular/cli`.

- Create a new project with `ng new <project-name>`.

- Replace the `app` folder of the new project with the old one.

- Add the Bootstrap path to the `build` section of `angular.json`:

  ```json
  "build": {
  // ...
  "styles": [
      "node_modules/bootstrap/dist/css/bootstrap.min.css",
      "src/styles.css"
  ],
  // ...
  ```

- Update the `appRoutes` definition in `app-routing.module.ts` with the `import()` syntax:

  ```ts
  const appRoutes: Routes = [
    {
      path: '',
      redirectTo: '/recipes',
      pathMatch: 'full',
    },
    {
      path: 'recipes',
      loadChildren: () =>
        import('./recipes/recipes.module').then((m) => m.RecipesModule),
    },
    {
      path: 'shopping-list',
      loadChildren: () =>
        import('./shopping-list/shopping-list.module').then(
          (m) => m.ShoppingListModule
        ),
    },
    {
      path: 'auth',
      loadChildren: () =>
        import('./auth/auth.module').then((m) => m.AuthModule),
    },
  ];
  ```

- Add the missing dependencies by running

  ```sh
  npm i @ngrx/effects @ngrx/router-store @ngrx/store bootstrap@3
  npm i -D @ngrx/store-devtools
  ```

- Replace the firebase urls

  - Either in the environment files
  - Or in the `constants` directory

- Test this Angular 11 version with `ng serve`.

#### Step 2

- If this works, add Angular Universal by running

  ```sh
  ng add @nguniversal/express-engine
  ```

- Apply the required changes in `app.component.ts`:

  ```ts
  import { ..., Inject, PLATFORM_ID } from '@angular/core';
  import { isPlatformBrowser } from '@angular/common';

  @Component({ ... })
  export class AppComponent implements OnInit {
    constructor(
        ...,
        @Inject(PLATFORM_ID) private platformId,
    ) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
        this.store.dispatch(new AuthActions.AutoLogin());
        }
        ...;
    }
  }
  ```

- Test live serving the Universal app on `localhost:4200` by running

  ```sh
  npm run dev:ssr
  ```

- The following two commands will work and serve a static build of the app on `localhost:4000`

  ```sh
  npm run build:ssr
  npm run serve:ssr
  ```
