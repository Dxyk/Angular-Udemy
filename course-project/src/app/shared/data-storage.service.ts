import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { FirebaseConfigs } from '../constants/firebase-configs';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/services/recipe.service';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
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
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user: User) => {
        return this.http.get<Recipe[]>(
          FirebaseConfigs.PROJECT_URL + '/' + FirebaseConfigs.RECIPES_ENDPOINT,
          {
            params: new HttpParams().set(
              FirebaseConfigs.AUTH_QUERY_PARAMETER,
              user.token
            ),
          }
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
      tap((recipes: Recipe[]) => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}
