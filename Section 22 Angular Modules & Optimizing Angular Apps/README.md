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

In `app.component.ts`,

- Remove all duplicated declarations declared in the `SharedModules`.
  - Note that Modules can be imported for multiple times, but declarations can only be declared once throughout the entire application.
- Import the `SharedModule` since the `AppModule` uses features inside it, e.g. `DropdownDirective`
- Remove the `entryComponent`

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