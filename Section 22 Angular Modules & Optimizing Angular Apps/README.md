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
- Now the program doesn't compile correctly because it is missing features (e.g. `RoutingModule`).
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
