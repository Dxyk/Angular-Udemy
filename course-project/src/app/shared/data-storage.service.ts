import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FirebaseConfigs } from '../constants/firebase-configs';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/services/recipe.service';
import * as RecipesActions from '../recipes/store/recipe.actions';
import * as fromApp from '../store/app.reducer';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>
  ) {}

  storeRecipes(): void {
    const recipes: Recipe[] = this.recipeService.getRecipes();
    this.http
      .put(
        FirebaseConfigs.PROJECT_URL + '/' + FirebaseConfigs.RECIPES_ENDPOINT,
        recipes
      )
      .subscribe((response: HttpResponse<object>) => {
        console.log(response);
      });
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.http
      .get<Recipe[]>(
        FirebaseConfigs.PROJECT_URL + '/' + FirebaseConfigs.RECIPES_ENDPOINT
      )
      .pipe(
        map((recipes: Recipe[]) => {
          return recipes.map((recipe: Recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ?? [],
            };
          });
        }),
        tap((recipes: Recipe[]) => {
          // this.recipeService.setRecipes(recipes);
          this.store.dispatch(new RecipesActions.SetRecipes(recipes));
        })
      );
  }
}
