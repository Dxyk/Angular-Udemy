# Section 22 Angular Modules & Optimizing Angular Apps

## Angular Modules

### Lesson 319 - Module Introduction

### Lesson 320 - What are Modules?

Angular **Modules** bundle Angular building blocks (e.g. Components, Directives, Services, Pipes, etc) together. Each Angular app must contain at least 1 module: `AppModule`.

A Module contains declarations of these building blocks. Angular analyzes these declarations in the `@NgModule` decorator and gains information about the application and features stored in the module.

There are also Angular's built in feature modules such as `FormsModule`, so consumers can also include these features in their `AppModule` and use them out of the box.

### Lesson 321 - Analyzing the AppModule

In the [course-project](../course-project), there are 2 modules: `AppModule` and `AppRoutingModule`.

In `@NgModule`, there are a few common properties

- `declarations` is an array of all the components, directives and custom pipes that are used in HTML templates or routes.
- `imports` is an array of imported modules. These could be Angular built-in modules or custom modules.
- `providers` is an array of all the services the current module provides. It is not always the case that services can only be used within the module. This will be explained in a later lesson.
  - All services that is injectable need to either be provided in `@NgModule({ providers: [] })` array, or `@Injectable({ providedIn: 'root' })`.
- `bootstrap` is an array that defines the Components available right away in the `index.html` when the application starts up.
- `entryComponents` are components created programmatically.
- `exports` is an array of features (Modules or Components) that an external module should have access to.
  - In Angular, all Modules work independently from each other.

### Lesson 322 - Getting Started with Feature Modules

Instead of having one module that contains all the features, it is better to have one lean `AppModule` and have multiple **Feature Modules**.

A Feature Module is a bundle of building blocks that are used in the same area of features.

Having Feature Modules is a pre-requisite to optimizing Angular apps, and it also makes the app structure clearer and easier to maintain.

In the course project, there are three main features: auth, recipes and shopping-list.

To mark a directory (e.g. recipes) as a module, create a `recipes.module.ts` at the root of the directory.

In `recipes.module.ts`, an initial attempt to separate `RecipesModule` from `AppModule`

- Move all Recipes related components from `AppModule` to `RecipesModule`
- Export these components since they are referenced elsewhere
- Now the program doesn't compile correctly because it is missing features (e.g. `RouterModule`).
  - This will be corrected in the next lesson

```ts
@NgModule({
  declarations: [
    RecipesComponent,
    RecipeDetailComponent,
    RecipeEditComponent,
    RecipeItemComponent,
    RecipeListComponent,
    RecipeStartComponent,
  ],
  exports: [
    RecipesComponent,
    RecipeDetailComponent,
    RecipeEditComponent,
    RecipeItemComponent,
    RecipeListComponent,
    RecipeStartComponent,
  ],
})
export class RecipesModule {}
```

In `app.module.ts`

- Remove recipes related components from declarations
- Add `RecipesModule` to imports

```ts
@NgModule({
  declarations: [ ... ],
  imports: [
    ...,
    RecipesModule,
  ],
  providers: [ ... ],
  bootstrap: [ ... ],
  entryComponents: [ ... ],
})
export class AppModule {}
```

### Lesson 323 - Splitting Modules Correctly

In `recipes.module.ts`

- Import all necessary modules
- Some modules like `BrowserModule` can only be imported once throughout the entire application, since it is also in charge of application startup logic that can only be run once
  - To avoid this, import `BrowserModule` in `AppModule` only, and import `CommonModule` in every other modules

```ts
@NgModule({
  declarations: [ ... ],
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  exports: [ ... ],
})
export class RecipesModule {}
```

### Lesson 324 - Adding Routes to Feature Modules

Except for building blocks, it is also possible to outsource routing maps from `app-routing.module.ts` to `recipes-routing.module.ts`.

In `recipes-routing.module.ts`

- Copy all the routes related to recipes from `app-routing.module.ts`
- Register the routes using `RouterModule.forChild(Routes)`
  - Note that only the top-level routing config should use `RouterModule.forRoot()`
  - All `RouterModule.forChild()` routes will be combined with the root routes
- Export the configured `RouterModule`

```ts
const routes: Routes = [ ... ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
```

In `recipes.module.ts`

- Import the `RecipesRoutingModule`

```ts
@NgModule({
  declarations: [ ... ],
  imports: [
    ...,
    RecipesRoutingModule,
  ],
  exports: [ ... ],
})
```

In `app-routing.module.ts`

- Remove recipes related routes
- Leave the imports and exports unchanged. The `RouteModule` will be configured in both routing modules, and exported by both, so eventually it contains all the route paths.

```ts
const appRoutes: Routes = [ ... ];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

### Lesson 325 - Component Declarations

It is important to note that within `@NgModule()`'s `declarations`, we need to declare not only components that are used outside the module, but also components that will be used via Routing.

For the `exports`, it is not necessary to export the components that are used via Routing, as long as the imports contain the outsourced routing module.

In `recipes-routing.module.ts`

```ts
@NgModule({
  declarations: [
    RecipesComponent,
    RecipeDetailComponent,
    RecipeEditComponent,
    RecipeItemComponent,
    RecipeListComponent,
    RecipeStartComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    RecipesRoutingModule, // outsourced routing module
  ],
})
export class RecipesModule {}
```

### Lesson 326 - The ShoppingList Feature Module

To create the ShoppingListModule, create `shopping-list.module.ts`. In it

- Declare all the shopping list components
- Import the necessary modules
- Import `RouterModule` and register the routes using `forChild`
  - Since the route for shopping-list is lightweight, it is not necessary to create a separate `ShoppingListRoutingModule`
- No need to export the `RouterModule`
  - See [Appendix](#appendix) for explanation

```ts
@NgModule({
  declarations: [ShoppingListComponent, ShoppingEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'shopping-list', component: ShoppingListComponent },
    ]),
  ],
})
export class ShoppingListModule {}
```

### Lesson 327 - Understanding Shared Modules

**Shared Modules** contain features that are shared between feature modules. These shared modules are used to avoid code duplication and maintain leaner feature modules.

In the [course project](../course-project), the shared feature is mostly defined in the shared folder, and on top of that, the `CommonModule` is imported for both `ShoppingListModule` and `RecipesModule`.

Create a `shared/shared.module.ts`. In it

- Declare all the building blocks used in the shared module
- Import the `CommonModule`
- Export building blocks that might be used by the feature modules, and also export the `CommonModule` so feature modules importing `SharedModule` won't need to import it again.
- Add the `AlertComponent` as `entryComponents` since it is referenced in the `SharedModule`

```ts
@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective,
  ],
  imports: [CommonModule],
  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective,
    CommonModule,
  ],
  entryComponents: [AlertComponent],
})
export class SharedModule {}
```

In `recipes.module.ts` and `shopping-list.module.ts`, replace `CommonsModule` with `SharedModule`

In `app.module.ts`,

- Remove all duplicated declarations declared in the `SharedModules`.
  - Note that Modules can be imported for multiple times, but declarations can only be declared once throughout the entire application.
- Import the `SharedModule` since the `AppModule` uses features inside it, e.g. `DropdownDirective`
- Remove the `entryComponent`

### Lesson 328 - Understanding the Core Module

**`CoreModule`** is used to move services out of the `AppModule` to make it leaner. This can also be done by using `@Injectable({ providedIn: 'root' })` in the services. The `CoreModule` should only be used when the services are provided in `AppModule`.

Create a `core.module.ts`. In it

- Move all providers from `AppModule` to `CoreModule`
- No need to export the services since
  - Services work differently than other building blocks
  - Services are automatically injected at the root level

```ts
@NgModule({
  providers: [
    ShoppingListService,
    RecipeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
})
export class CoreModule {}
```

In `app.module.ts`

- Remove providers
- Import `CoreModule`

### Lesson 329 - Adding an Auth Feature Module

In `auth.module.ts`

- Declare auth Components
- Import necessary Modules
- Register the auth route through `RouterModule.forChild`

```ts
@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([{ path: 'auth', component: AuthComponent }]),
  ],
})
export class AuthModule {}
```

In `app.module.ts`

- Remove auth related declarations
- Remove unnecessary imports
  - Keep `BrowserModule` and `HttpClientModule` since they must be imported in `AppComponent`
- Import `AuthModule`

In `app-routing.module.ts`

- Remove routes related to auth

### Lesson 330 - Understanding Lazy Loading

Separating the application into different modules does not have only cosmetic effects. It is also a pre-requisite to **Lazy Loading**.

Lazy Loading allows the app to only load specific modules when the user access the corresponding route, instead of loading everything all at once.

Examples

- When the user accesses `/`, we load only the `AppModule` and/or `CoreModule`
- When the user accesses `/recipes`, we load the `RecipesModule` along with `AppModule` and `CoreModule`

Lazy Loading allow a smaller initial download size and thus improves the app load time.

### Lesson 331 - Implementing Lazy Loading

To enable Lazy loading, the feature modules must carry its own routes (either in `feature.module.ts` or `feature-routing.module.ts`) using `RouterModule.forChild()`.

In `recipes-routing.module.ts`

- Remove the top level route path and make it an empty string (`path: 'recipes'` => `path: ''`)

```ts
const routes: Routes = [
  {
    path: '',
    component: ...,
    canActivate: [ ... ],
    children: [ ... ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
```

In `app-routing.module.ts`

- Add the removed route path for the feature module
- Use `loadChildren` to detach the feature module and inform Angular to only download and parse the child modules when the path is accessed
  - For newer syntax
    - An anonymous function that calls `import(<relative/path/to/featureModule>).then(module => module.FeatureModuleClassName)`
  - For older syntax
    - The value is a string of `<relative path to the feature module file without file extension>#<module class name>`
- It is also important to make sure there are no imports to the detached feature module in the other modules for lazy loading to work.

```ts
const appRoutes: Routes = [
  { ... },
  {
    path: 'recipes',
    // loadChildren: () =>
    //   import('./recipes/recipes.module').then((m) => m.RecipesModule),
    loadChildren: './recipes/recipes.module#RecipesModule',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

In `app.module.ts`

- Remove both the imports for `RecipesModule` and the import statement for `RecipesModule`
  - Not removing them will cause the app to throw an error since it is trying to load the module both eagerly and lazily.

When done enabling lazy loading, we need to rerun `ng serve` to let it take effect.

### Lesson 332 - More Lazy Loading

Add lazy loading for auth and shopping list modules.

In `app-routing.module.ts`

```ts
const appRoutes: Routes = [
  ...,
  { path: 'shopping-list', loadChildren: './shopping-list/shopping-list.module#ShoppingListModule' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

In `auth.module.ts`

```ts
@NgModule({
  declarations: [ ... ],
  imports: [
    ...,
    RouterModule.forChild([{ path: '', component: AuthComponent }]),
  ],
})
export class AuthModule {}
```

In `shopping-list.module.ts`

```ts
@NgModule({
  declarations: [ ... ],
  imports: [
    ...,
    RouterModule.forChild([
      { path: '', component: ShoppingListComponent },
    ]),
  ],
})
export class ShoppingListModule {}
```

In `app.module.ts`

- Remove both the imports for `AuthModule`, `ShoppingListModule` and the import statement for `AuthModule`, `ShoppingListModule`

### Lesson 333 - Preloading Lazy-Loaded Code

One downside to lazy-loading is that there might be a slight delay due to the download when loading the feature module. To overcome this, it is possible to tell Angular to preload the lazy-loaded module.

This is different from eager-loading the application because the application will first load up the required module depending on the route, and after the required module is loaded up, it will download and parse the rest of the modules, so when we access those modules, it'll already be loaded.

In `app-routing.module.ts`

- In `RouterModule.forRoot()`, pass in a config object
  - In the config object, set `preloadingStrategy: PreloadAllModules` to preload all modules after the required app is loaded.

```ts
...
@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        preloadingStrategy: PreloadAllModules
      }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

### Lesson 334 - Modules & Services

Services are a special building block in Angular apps because it can be provided in different ways and they have different impacts.

A service can be provided through

- `AppModule` / `@Injectable({ providedIn: 'root' })`
  - Using Root Injector
  - The service will be available application-wide and all references will be the same instance of the service
  - Should be used as the Default option (Using `@Injectable({ providedIn: 'root' })`)
- `AppComponent` or other component
  - Using Component-specific Injector
  - The service will only be available in the component-tree.
    - I.e. All components referenced by the component will have access to the same instance of the service
  - If the service is provided to a sibling component, the sibling component will also have the service, but of a different instance
  - Should be used if the service is only relevant for the component tree
- Eager-loaded Module's `providers`
  - Using Root Injector
  - The service will be available application-wide nd all references will be the same instance of the service
  - Should AVOID doing this because
    - It may lead to undesired behaviors
    - It makes the code hard to debug and understand
- Lazy-loaded Module's `providers`
  - Using Child Injector
  - The service will only be available in the loaded module
  - Should be used if the service should be scoped to the loaded module

### Lesson 335 - Loading Services Differently

An example that would explain the above 4 scenarios further

Create `logging.service.ts`

```ts
export class LoggingService {
  lastLog: string;

  printLog(message: string) {
    console.log(message);
    console.log(this.lastLog);
    this.lastLog = message;
  }
}
```

In `app.component.ts` and `shopping-list.component.ts`, call `LoggingService.printLog()` with different values

- `AppModule` / `@Injectable({ providedIn: 'root' })`
- Eager-loaded Module's `providers` (provided in `CoreComponent`)

  ```txt
  // app loaded
  AppComponent
  undefined
  // shopping-list component loaded
  ShoppingListComponent
  AppComponent
  ```

  - This is because both components are using the same instance of the service

- Lazy-loaded Module's `providers` (Provide in both `AppModule` and `ShoppingListModule`)

  ```txt
  // app loaded
  AppComponent
  undefined
  // shopping-list component loaded
  ShoppingListComponent
  undefined
  ```

  - This is because the `ShoppingListComponent` is using a different instance of `LoggingService` than `AppComponent`
  - Note the same behavior applies to imported modules as well.
    - E.g. provide `LoggingService` in `SharedModule`
    - Produces the same result because the `SharedModule` is eagerly loaded in `AppModule`, but lazily loaded in `ShoppingListModule`

### Lesson 336 - Ahead-of-Time Compilation

In an Angular app, there are 2 steps in the **Compilation Process**

1. The TS compiler compiles Angular TS code to JS
2. Angular template compiler compiles Template syntax to JS DOM instructions
   - Since all HTML template and code are only recognizable by Angular. Angular needs to translate all these code to DOM instructions
   - This compiler is shipped with in built code

There are 2 approaches to the second step

- **Just-in-Time (JiT) Compilation**
  - The compile happens in the browser right before the application is rendered
  - Though the compile time is short, it is still a performance hit
- **Ahead-ofTime (AoT) Compilation**
  - The compiler runs during the build process, which is before the app is deployed
  - In the final bundle, the compiler is removed since it is not needed anymore, thus saving space and runtime

By default, in development environment, we use `ng serve`, which uses Just-in-Time Compilation.

- It spins up a development server
- It is easier for debugging
- It provides fast updating while running the application

However, in production environment, we use `ng build --prod`, which uses Ahead-of-Time Compilation.

- This optimizes the code as much as possible so the bundle is small and the application runs faster.
- This builds the entire app into a few file under the `dist` folder, which is ready for deploy.
- This is more strict on the syntax. It will fail if anything doesn't compile.

### Lesson 337 - Wrap Up

- Modules and types of Modules
- Routing and Modules
- Services and Modules
- Lazy-loading
- AoT Compilation

### Lesson 338 - Useful Resources & Links

- [Official Docs](https://angular.io/guide/ngmodules)
- [NgModules FAQ](https://angular.io/guide/ngmodule-faq)

## Appendix

### RouterModule

The usage of `RouterModule` is rather complex, since this module has several tasks.

In `RouterModule` several directives are declared, which are needed in multiple components in connection with routing (like `RouterOutlet`, `RouterLink`, `RouterLinkActive` etc.).

Additionally `RouterModule` should provide the services which manage the different routes arrays of the feature modules. And last but not least: `RouterModule` should provide an instance of the `Router` service itself.

#### The problem

This dual role, declaring directives and providing services, - actually nothing special for a module - causes a problem in the case of `RouterModule`:

1. We know that a directive (like a component) can be declared only once in an app, in the declarations array of one particular module, not more often. That means we have to import `RouterModule` in multiple modules of our app, in order to make the routing directives mentioned above available in all places where they are needed.

2. But this could involve the risk of getting multiple instances of the services, if those would be provided in the usual manner in a providers array directly in the `@NgModule` annotation of `RouterModule`.

And this should not happen: It’s clear that the services which are responsible for the routes arrays of the different feature modules, as well as the `Router` instance itself, have to be singletons.

#### The solution

The basic version of the `RouterModule` contains only the directives mentioned above which are needed for routing in the components. Nothing more. This simple version of `RouterModule` can be imported in as many modules as required without any risk.

If you call `RouterModule.forChild(myChildRoutes)` in a feature module, this method returns an enhanced `RouterModule`, which contains not only these directives, but additionally the services which are required for handling `myChildRoutes`.

You will import this modified version only once in the routing module of that feature module. And important: **The original `RouterModule` will not be modified; you will export the unmodified `RouterModule` version from the routing module**, which then can be used in the related feature module for accessing the directives in multiple places.

And `RouterModule.forRoot(myRootRoutes)` acts similarly. This method returns an enhanced version of `RouterModule` as well (again without modifying the original `RouterModule`), containing the directives, the providers for `myRootRoutes`, and in this case also the provider for the `Router` instance itself.

This version of the `RouterModule` should only be imported once in your app (in `app-routing.module.ts`), and you will get an error if you try to use it in a lazy loaded module (since then you would get a new instance of the `Router`, and that has to be avoided under any circumstances). And of course you will export the unmodified `RouterModule` version from `app-routing.module.ts` for the import and further usage in `app.module.ts`.
