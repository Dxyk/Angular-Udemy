import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { FirebaseConfigs } from 'src/app/constants/firebase-configs';
import * as fromApp from 'src/app/store/app.reducer';
import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipe.actions';

@Injectable()
export class RecipeEffects {
  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(
        FirebaseConfigs.PROJECT_URL + '/' + FirebaseConfigs.RECIPES_ENDPOINT
      );
    }),
    map((recipes: Recipe[]) => {
      return recipes.map((recipe: Recipe) => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ?? [],
        };
      });
    }),
    map((recipes: Recipe[]) => {
      return new RecipesActions.SetRecipes(recipes);
    })
  );

  @Effect({ dispatch: false })
  storeRecipes = this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http.put(
        FirebaseConfigs.PROJECT_URL + '/' + FirebaseConfigs.RECIPES_ENDPOINT,
        recipesState.recipes
      );
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
