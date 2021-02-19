import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FirebaseConfigs } from '../constants/firebase-configs';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/services/recipe.service';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipes(): void {
    const recipes: Recipe[] = this.recipeService.getRecipes();
    this.http
      .put(
        FirebaseConfigs.FIREBASE_URL + '/' + FirebaseConfigs.RECIPES_ENDPOINT,
        recipes
      )
      .subscribe((response: HttpResponse<object>) => {
        console.log(response);
      });
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.http
      .get<Recipe[]>(
        FirebaseConfigs.FIREBASE_URL + '/' + FirebaseConfigs.RECIPES_ENDPOINT
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
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
