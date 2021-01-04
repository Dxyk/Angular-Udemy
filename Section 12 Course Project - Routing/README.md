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
