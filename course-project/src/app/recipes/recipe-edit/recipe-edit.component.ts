import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromApp from 'src/app/store/app.reducer';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../services/recipe.service';
import * as RecipesActions from '../store/recipe.actions';
import * as fromRecipe from '../store/recipe.reducer';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  private storeSubscription: Subscription;

  id: number;

  editMode = false;

  recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  onSubmit(): void {
    const recipe = new Recipe(
      this.recipeForm.value.name,
      this.recipeForm.value.description,
      this.recipeForm.value.imagePath,
      this.recipeForm.value.ingredients
    );
    if (this.editMode) {
      // this.recipeService.updateRecipe(this.id, recipe);
       this.store.dispatch(
        new RecipesActions.UpdateRecipe({
          index: this.id,
          newRecipe: recipe,
        })
      );
    } else {
      // this.recipeService.addRecipe(recipe);
      this.store.dispatch(new RecipesActions.AddRecipe(recipe));
    }
    this.onCancel();
  }

  get controls(): AbstractControl[] {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient(): void {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  onDeleteIngredient(index: number): void {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
  }

  private initForm(): void {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    const recipeIngredients = new FormArray([]);

    if (this.editMode) {
      // const recipe = this.recipeService.getRecipe(this.id);
      this.storeSubscription = this.store
        .select('recipes')
        .pipe(
          map((recipeState: fromRecipe.State) => {
            return recipeState.recipes.find(
              (_recipe: Recipe, index: number) => {
                return index === this.id;
              }
            );
          })
        )
        .subscribe((recipe: Recipe) => {
          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;
          if (recipe.ingredients) {
            for (const ingredient of recipe.ingredients) {
              recipeIngredients.push(
                new FormGroup({
                  name: new FormControl(ingredient.name, Validators.required),
                  amount: new FormControl(ingredient.amount, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/),
                  ]),
                })
              );
            }
          }
        });
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    });
  }
}
