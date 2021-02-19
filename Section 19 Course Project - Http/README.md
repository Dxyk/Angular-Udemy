# Section 19 Course Project - Http

## Course Project

### Lesson 278 - Module Introduction

Goal: Enable the top right corner's Manage -> save data / fetch data buttons to persist and retrieve data.

### Lesson 279 - Backend (Firebase) Setup

In [Firebase](https://console.firebase.google.com)

1. Create a new project
2. Set a name
3. Enter Realtime Database
4. Create Database
5. Start in test mode
6. The returned URL will be the URL to send requests to for this project

### Lesson 280 - Setting Up the DataStorage Service

Create a DataStorageService in the shared directory

In `app.module.ts`

- Import `HttpClientModule`

In `data-storage.service.ts`

- Make `@Injectable{}` since we will inject `RecipeService` into this service
- Inject `HttpClient`

### Lesson 281 - Storing Recipes

In `data-storage.service.ts`

- Inject `RecipeService`
- Create a `storeRecipes()` method that
  - Gets the list of recipes using `RecipeService.getRecipes()`
  - Store the list and override existing recipes in Firebase using its `PUT` endpoint
  - Subscribe to the PUT method, and log the response
  - No need to return the observable since the header component does not care about the object returned by the PUT request.

In `header.component.html`

- Add a click listener to the Save Data button

In `header.component.ts`

- Inject `DataStorageService`
- Add the `onSaveData()` method that calls `DataStorageService.storeRecipes()`

### Lesson 282 - Fetching Recipes

In `recipe.service.ts`

- Implement a `setRecipes(recipes)` method that
  - Overrides the cached recipes list with the input recipes list
  - Emits a `recipesChanged` so the components can be updated

In `data-storage.service.ts`

- Create a `fetchRecipes()` method that
  - Fetch the list of recipes from Firebase using its `GET` endpoint
  - Set the generic type in the `HttpClient.get<T>()` to `Recipe[]`
  - Subscribe to the GET method and update the local cache using `RecipeService.setRecipes()` method

In `header.component.html`

- Add a click listener to the Fetch Data button

In `header.component.ts`

- Add the `onFetchData()` method that calls `DataStorageService.fetchRecipes()`

### Lesson 283 - Transforming Response Data

Goal: When creating an empty recipe, the `Recipe.ingredients` `Ingredient` list is not populated, so directly accessing it might trigger NPE. It would be better if after fetching the recipes, we can add the ingredients field as an empty list if it does not exist.

In `recipe.service.ts`

- Remove the pre-populated data and re-initialize the `recipes` list as an empty list

In `data-storage.service.ts`

- Add a `pipe()` method to the `fetchRecipes()` method that
  - Uses the RxJS `map` operator to return a new array of Recipe by
    - Using the `Array.map()` method to map each recipe to a new recipe and make the `ingredients` attribute empty if it does not exist.

```ts
import { ... } from '...';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  ...
  fetchRecipes(): void {
    this.http
      .get<Recipe[]>( ... )
      .pipe(
        map((recipes: Recipe[]) => {
          return recipes.map((recipe: Recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ?? [],
            };
          });
        })
      )
      .subscribe((response: Recipe[]) => { ... });
  }
}
```

### Lesson 284 - Resolving Data Before Loading

Goal: Use a resolver (RouteModule) to make sure the data the route points to is there.

Create a `recipes-resolver.service.ts`

- Inject`DataStorageService`
- Implement the `Resolve` interface of type `Recipe[]`
- Implement `resolve(route, state)` method that fetches the data by calling `DataStorageService.fetchRecipes()` method

In `DataStorageService`

- Use the `tap` RxJS operator to set the recipes in `RecipeService`
- Remove the `subscribe` method
- Update `fetchRecipes` to return the observable

In `header.component.ts`

- Subscribe to the `DataStorageService.fetchRecipes()` method
- No need to pass in a callback since the header does not care about the data
- The data is updated in the service method with the `RecipeService`

In `app-routing.module.ts`

- Add `resolve: [RecipesResolverService]` to the `:id` and `:id/edit` paths.
  - The `resolve` property makes sure that the resolvers' `resolve()` method is called before loading the component is loaded
  - With the resolve method loading the recipes list, we avoid the NPE

### Lesson 285 - Fixing a Bug with the Resolver

Goal: The current resolver implementation does not allow edits because every time we visit a `:id` route, the resolver fetches the recipes list form the Firebase server.

The solution to this bug is to only fetch recipes from the server in the resolver when the recipes list is empty, and return the original recipes list otherwise.

In `recipes-resolver.service.ts`

- Inject `RecipeService`
- Check if the existing recipes list is empty
  - If it is, then fetch from the server
  - If it isn't, then return the existing recipes list

```ts
import { ... } from '...';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  ...
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    const recipes = this.recipeService.getRecipes();
    if (recipes.length === 0) {
      return this.dataStorageService.fetchRecipes();
    } else {
      return recipes;
    }
  }
}
```
