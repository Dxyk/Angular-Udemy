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
