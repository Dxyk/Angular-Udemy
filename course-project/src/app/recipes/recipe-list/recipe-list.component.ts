import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromApp from 'src/app/store/app.reducer';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../services/recipe.service';
import * as fromRecipe from '../store/recipe.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();

  recipes: Recipe[];

  recipesChangeSubscription: Subscription;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    // this.recipesChangeSubscription = this.recipeService.recipesChanged.subscribe(
    this.recipesChangeSubscription = this.store
      .select('recipes')
      .pipe(
        map((recipeState: fromRecipe.State) => {
          return recipeState.recipes;
        })
      )
      .subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
      });
    this.recipes = this.recipeService.getRecipes();
  }

  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.recipesChangeSubscription.unsubscribe();
  }
}
