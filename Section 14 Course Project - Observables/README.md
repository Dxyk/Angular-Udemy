# Section 14 Course Project - Observables

## Course Project

### Lesson 179 - Improving the Reactive Service with Observables (Subjects)

With `Subject.next()`, we can replace `EventEmitter.emit()`.

In `shopping-list.service.ts`

```ts
import { ... } from '';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();

  ...

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
```

On the subscriber/consumer side, the subscription part is identical. However, we need to remember to unsubscribe from the subscriptions

In `shopping-list.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class ShoppingListComponent implements OnInit, OnDestroy {
  private ingredientChangeSubscription: Subscription;

  ...

  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients();
    this.ingredientChangeSubscription = this.shoppingListService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      }
    );
  }

  ngOnDestroy() {
    this.ingredientChangeSubscription.unsubscribe();
  }
}
```

### Lesson 180 - Changed the Subscription Name
