# Section 12 Course Project - Routing

## Course Project

### Lesson 154 - Planning the General Structure

Goal

- Instead of using `ngIf` to navigate around the page, use routers to allow users to navigate the app.
- Add a recipe edit component using data carried in routes

### Lesson 155 - Setting Up Routes

Create `app-routing.modules.ts`

- Add paths for recipes and shopping-list
- Make home path redirect to recipes
  - Remember to make `pathMatch: 'full'`, or else it will match all possible paths and throw an error
- Import `RouterModule.forRoot(paths)`
- Export `RouterModule`

```ts
import { ... } from '...';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes', component: RecipesComponent },
  { path: 'shopping-list', component: ShoppingListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

Update `app.module.ts` to import the `AppRoutingModule`.

Use `<router-outlet></router-outlet>` to display the corresponding components

### Lesson 156 - Adding Navigation to the App

Goal

- Make header buttons point to correct routes

In `header.component.html`

```html
<ul class="nav navbar-nav">
  <li><a routerLink="/recipes">Recipes</a></li>
  <li><a routerLink="/shopping-list">Shopping List</a></li>
</ul>
```

Remove redundant event listener ane event emitter in `header.component.ts`

### Lesson 157 - Marking Active Routes

Goal

- Mark the active route using bootstrap css

In `header.component.html`

- Add attribute `routerLinkActive="active"` to `<li>` tags

```html
<ul class="nav navbar-nav">
  <li routerLinkActive="active">
    <a routerLink="/recipes">Recipes</a>
  </li>
  <li routerLinkActive="active">
    <a routerLink="/shopping-list">Shopping List</a>
  </li>
</ul>
```

### Lesson 158 - Fixing Page Reload Issues

Goal

- Fix all `<a href="#">` page reload issues in `recipe-item.component.html`

In `<a href="">`, the `href` attribute sends a request to the web server, thus reloading the page. This is not desired, and we should replace this `href` with `style:"cursor:pointer;"`.

### Lesson 159 - Child Routes: Challenge

Goal

- Instead of using event listener to load the components, use child routes
  - E.g. `/recipes/{id}`
- Build a recipe edit component for creating and editing the recipes

### Lesson 160 - Adding Child Routing Together

Goal

- Add child routes for recipes

Create a `recipe-start` component by

```sh
ng g c recipes/recipe-start
```

Update `app-routing.module.ts` to contain the recipe-start child route

Update `recipes.component.html` to use a `<router-outlet></router-outlet>` as place holders for the components depending on the routes

### Lesson 161 - Configuring Route Parameters

Goal

- Currently, the `recipe` property in the `RecipeDetailComponent` is set through property binding. We wish to retrieve the recipe on route change

Update `RecipeItemComponent` to remove the logic for passing the recipe id to `RecipeDetailComponent`

Update `RecipeDetailComponent` to subscribe to the `ActivatedRoute.param` observable and update the recipe during runtime.

### Lesson 162 - Passing Dynamic Parameters to Links

Goal

- Pass in the `id` of the recipe when we click on them

Update `recipe-item.component.html` to append the id in the router link

```html
<a ... [routerLink]="[index]">...</a>
```

Update `recipe-item.component.ts` to take in `index` through property binding

Update `recipe-list.component.html` to pass the index of the recipe through the `*ngFor` directive

```html
<app-recipe-item
  *ngFor="let recipeEl of recipes; let i = index"
  [recipe]="recipeEl"
  [index]="i"
></app-recipe-item>
```

### Lesson 163 - Styling Active Recipe Items

Goal

- Add style to mark the selected recipe

Update `recipe-item.component.html` to use `routerLink="active"`

### Lesson 164 - Adding Editing Routes

Goal

- Be able to create new recipes and edit existing ones

Add two routes `/recipes/:id/edit` and `/recipes/new`. The `/new` route will not work because `/recipes/:id` comes before it, and Angular will try to parse `new` as the `id`.

To resolve this, put the `/new` route before the `/:id` route.
