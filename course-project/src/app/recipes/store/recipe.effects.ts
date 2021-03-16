import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { FirebaseConfigs } from 'src/app/constants/firebase-configs';
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

  constructor(private actions$: Actions, private http: HttpClient) {}
}
