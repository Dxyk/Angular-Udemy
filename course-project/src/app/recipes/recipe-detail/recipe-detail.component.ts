import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import * as fromApp from 'src/app/store/app.reducer';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../services/recipe.service';
import * as RecipesActions from '../store/recipe.actions';
import * as fromRecipe from '../store/recipe.reducer';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    // this.route.params.subscribe((params: Params) => {
    //   this.id = +params['id'];
    //   this.recipe = this.recipeService.getRecipe(this.id);
    // });

    this.route.params
      .pipe(
        map((params: Params) => {
          return +params.id;
        }),
        switchMap((id: number) => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map((recipeState: fromRecipe.State) => {
          return recipeState.recipes.find((_recipe: Recipe, index: number) => {
            return index === this.id;
          });
        })
      )
      .subscribe((recipe: Recipe) => {
        this.recipe = recipe;
      });
  }

  onAddToShoppingList() {
    this.recipeService.addIngredientToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}
