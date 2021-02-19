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
