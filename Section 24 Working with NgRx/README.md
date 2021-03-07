# Section 24 Working with NgRx

## NgRx

### Note

As of now (2021-03-07), to make everything compile, there are a few project setup items needed

- In `tsconfig`
  - The TS target version should be `"target": "es2015"`
    - Note this will be incompatible with IE 11
  - All `'strict'` settings should be false
- In `package.json`
  - The version for ngrx should be `"@ngrx/store": "^10.1.2"`

### Lesson 344 - Module Introduction

**NgRx** is a state management package maintained and developed by parts of the Angular team.

### Lesson 345 - What is Application State?

**State** refers to the data that controls what should be rendered on the screen. This data could refer to business data (e.g. `recipes`) or logic data (`isLoading`). The state is managed by memory, and is lost whenever the application is closed / refreshed.

**Application State** is a subset of State, and refers to only business related data.

To solve the refresh issue, we use a backend (server) to store a **Persistent State**. Whenever the application is loaded or refreshed, it would retrieve the persisted state from the backend.

The problem with this is that for larger apps, state management will get more complicated because more components and services are interacting with each other.

A part of the solution is `RxJS`, which provides features such as Observables and Operators, so the state change event can be emitted and subscribed. This is already a pretty good solution, but the downside is that developers need to keep track of the uni-direction data stream, and it will also be harder to modify this data stream.

### Lesson 346 - What is NgRx?

Downsides of using `RxJS` only is that there isn't a specific pattern enforced. Some effects are

- The state can be updated anywhere, which is hard to track
- State is possibly mutable. This leads to Angular not picking up the change of state because the state object's reference is unchanged
- The handling of side effects (e.g. Http calls) is unclear

**Redux** is a library that helps implement the **Redux Pattern**. The philosophy behind the Redux Pattern is that

- The application would use a single `Store` as a source of truth for the Application State
  - A `Store` can be thought of as a JS object
- The building blocks for the application can still interact with each other, but they will get the application state from the centralized `Store`
- When a building block needs to change the state, they **Dispatch** `Action`s
  - An `Action` can be viewed as a JS object that contains
    - An Identifier - Identify the kind of action to perform
    - A Payload (optional) - The data
- The dispatched `Action` gets sent to `Reducers`
  - A `Reducer` is a JS function that takes in
    - The current State (from the `Store`)
    - The `Action` (Passed in automatically by Redux library if it's used)
  - The `Reducer` will
    - Check the `Action` type using its identifier
    - Update the State in an Immutable way
      - I.e. Copy the State, perform updates on the copied state
    - Return the new State
- The returned State gets forwarded to the `Store` and the `Store` saves the reduced State

The Redux Pattern provides a cleaner way of storing the application state because

- It provides a centralized place for storing app data
- The state is modified using `Actions` only
- The state is fetched using `Subscriptions` which the developers can set up

**NgRx** is the Angular implementation of the Redux Library. The main differences or added features are

- The NgRx implementation is deeply integrated into Angular
- It uses RxJS
- It uses TS instead of JS
- It allows side effect handling by listening to the `Action`s

NgRx Workflow:

<img src="./images/NgRx.png" alt="Redux Workflow">

### Lesson 347 - Getting Started with Reducers

Install NgRx using `npm install --save @ngrx/store`

Create a `shopping-list.reducer.ts` file. In it

- Declare an initial state
  - Copy the `ingredients` list from `ShoppingListService`
- Define and export a function `shoppingListReducer`
  - This function will be used by NgRx when we introduce it
  - The function takes in
    - A `state`
      - Set the initial state as default argument
      - If the state is not set or null, then the `initialState` is used
    - An `action`

```ts
const initialState = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
};

export function shoppingListReducer(state = initialState, action) {}
```

### Lesson 348 - Adding Logic to the Reducer

In `shopping-list.reducer.ts`

- The reducer updates the state base on the type of action (`Action.type`).
  - The type is an action identifier defined by the developer and the convention is to use `UPPERCASE_NAMES`.
- The returned updated `State` must be an immutable update.
  - I.e. the state must be copied and updated instead of updating and returning the original state.
  - Use the `...object` syntax to copy the value from the object. This object can be a JS object or array.
- The data change will be encapsulated in the `Action`, which will be added in the next lecture

```ts
export function shoppingListReducer(state = initialState, action: Action) {
  switch (action.type) {
    case 'ADD_INGREDIENT':
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          action, // this is not yet correct
        ],
      };
  }
}
```

### Lesson 349 - Understanding & Adding Actions

With the `Reducer` set up, now we should set up `Action`s. In NgRx, `Action` is an interface that forces only a `type` identifier.

Create a `store` directory, create a `shopping-list.actions.ts`. In it

- Export a constant that represents the `ADD_INGREDIENT` action type identifier
- Export a `AddIngredient` class that implements NgRx `Action`
  - Implement the `type` parameter and define it as `ADD_INGREDIENT`
    - Make the `type` parameter `readonly`. This is similar to `final` in Java, which forbids any further modification to this property.
  - Include a `payload` property that carries the data, which will be the type of `Ingredient` in this case.

```ts
export const ADD_INGREDIENT = 'ADD_INGREDIENT';

export class AddIngredient implements Action {
  readonly type = ADD_INGREDIENT;
  payload: Ingredient;
}
```

Move `shopping-list.reducer.ts` to the `store` directory. In it

- Substitute the string action type with the constant defined in `shopping-list.actions.ts`

```ts
export function shoppingListReducer(state = initialState, action: Action) {
  switch (action.type) {
    case ADD_INGREDIENT:
      return {...};
  }
}
```

### Lesson 350 - Setting Up the NgRx Store

In `shopping-list.reducer.ts`

- Import everything from `shopping-list.actions.ts` by using `import * as ShoppingListActions from 'shopping-list.actions'`
- Properly use the payload in the AddIngredient action

```ts
import * as ShoppingListActions from './shopping-list.actions';
...
export function shoppingListReducer(
  state = initialState,
  action: ShoppingListActions.AddIngredient
) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload],
      };
  }
}
```

To set up the store

In `app.module.ts`

- Import `StoreModule` from NgRx
- Use the `StoreModule.forRoot()` method to register the reducers
  - It takes in `ActionReducerMap` as input, which is just a JS object
    - The key is an arbitrary identifier that represents the feature the reducer will cover
    - The value is the actual reducer object

```ts
@NgModule({
  declarations: [ ... ],
  imports: [
    ...,
    StoreModule.forRoot({ shoppingList: shoppingListReducer }),
  ],
  bootstrap: [ ... ],
})
export class AppModule {}
```

### Lesson 351 - Selecting State

To use the state to get the shopping list ingredients

In `shopping-list.component.ts`

- Inject the store in the constructor
  - The `Store` object takes in type parameter as an JS object
    - The key is the identifier used in `AppModule`
    - The value is the return type (state type) of the reducer
- Modify `ingredients` to an `Observable`
- In `ngOnInit`, use `Store.select()` to select the slice of the state
  - The slice is identified as a string, which is the identifier mentioned above
  - The method returns an `Observable` of the type of the state type

```ts
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(
    ...,
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
  ) {}

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
  }

  ngOnDestroy() {}
}
```

In `shopping-list.component.html`

- Modify the `*mgFor` to use a `async` pipe to resolve the `Observable`, and get the `ingredients` list after the observable is resolved

```html
<a
  class="list-group-item"
  style="cursor: pointer"
  *ngFor="let ingredient of (ingredients | async).ingredients; let i = index"
  (click)="onEditItem(i)"
>
  {{ ingredient.name }} ({{ ingredient.amount }})
</a>
```

In `shopping-list.reducer.ts`

- Add a `default` statement that returns the state when the action is unknown to avoid errors

```ts
export function shoppingListReducer(
  state = initialState,
  action: ShoppingListActions.AddIngredient
) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      ...;
    default:
      return state;
  }
}
```

### Lesson 352 - Dispatching Actions

Another place to dispatch Actions in the app is in the shopping-edit component.

In `shopping-list.actions.ts`

- Use the constructor to include the `payload` property so all `AddIngredient` actions require it during construction

```ts
export class AddIngredient implements Action {
  readonly type = ADD_INGREDIENT;

  constructor(public payload: Ingredient) {}
}
```

In `shopping-edit.component.ts`

- Instead of using the service to add an ingredient, dispatch an `AddIngredient` action using `Store.dispatch`
  - `Store.dispatch()` takes in an action, and does not return anything

```ts
@Component({ ... })
export class ShoppingEditComponent implements OnInit, OnDestroy {
  constructor(
    ...,
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
  ) {}

  onSubmit(formElement: NgForm) {
    ...;
    if (this.editMode) {
      ...;
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    ...;
  }
}
```

The workflow of dispatching an action

1. An `Action` is dispatched using `Store.dispatch()`
2. The Action reaches all the registered Reducers (Registered using `StoreModule.forRoot({identifier: reducer})`)
   1. The action is passed in as the second argument in the Reducer function
   2. The Reducer checks the type of action and react correspondingly

### Lesson 353 - Multiple Actions

To add another action, e.g. Add multiple recipes

In `shopping-list.actions.ts`

- Add a new constant `ADD_INGREDIENTS` indicating the type of the new actions
- Add a new Action `AddIngredients`
  - Use the above type
  - Include `payload` of array of `Ingredient`s in the constructor
- Export a `type` of `ShoppingListActions`, which is a union of all possible Action types

```ts
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';

export class AddIngredients implements Action {
  readonly type = ADD_INGREDIENTS;

  constructor(public payload: Ingredient[]) {}
}

export type ShoppingListActions = AddIngredient | AddIngredients;
```

In `shopping-list.reducer.ts`

- React to the new action type
  - Use `...list` to unpack the list object to add all list item to the list

```ts
export function shoppingListReducer(
  state = initialState,
  action: ShoppingListActions.ShoppingListActions
) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };
    ...
  }
}
```

In `recipe.service.ts`

- Inject the store
- Use `Store.dispatch()` to dispatch the `AddIngredients` event

```ts
@Injectable({ ... })
export class RecipeService {
  constructor(
    ...,
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
  ) {}

  addIngredientToShoppingList(ingredients: Ingredient[]): void {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }
}
```

### Lesson 354 - Preparing Update & Delete Actions

In `shopping-list.actions.ts`

- Add `UpdateIngredients` Action, which takes in an object of index and ingredient as payload
- Add `DeleteIngredients` Action, which takes only the index as payload
- Add both Actions to the `ShoppingListActions` type

```ts
export const UPDATE_INGREDIENTS = 'UPDATE_INGREDIENTS';
export const DELETE_INGREDIENTS = 'DELETE_INGREDIENTS';

export class UpdateIngredients implements Action {
  readonly type = UPDATE_INGREDIENTS;

  constructor(public payload: { index: number; ingredient: Ingredient }) {}
}

export class DeleteIngredients implements Action {
  readonly type = DELETE_INGREDIENTS;

  constructor(public payload: number) {}
}

export type ShoppingListActions =
  | AddIngredient
  | AddIngredients
  | UpdateIngredients
  | DeleteIngredients;
```

### Lesson 355 - Updating & Deleting Ingredients

In `shopping-list.reducer.ts`

- Add logic to handle Action of type `UPDATE_INGREDIENTS`
  - Copy all objects and lists that will be modified
  - Note that NgRx forbids mutable modifications to the state, and this applies to objects stored in the state as well
  - I.e. the objects in the state must be copied and then modified
- Add logic to handle Action of type `DELETE_INGREDIENTS`
  - Use the `filter()` method, which returns a copy of the list, and only retain elements that evaluates to true in the passed in method

```ts
export function shoppingListReducer(
  state = initialState,
  action: ShoppingListActions.ShoppingListActions
) {
  switch (action.type) {
    case ShoppingListActions.UPDATE_INGREDIENTS:
      const ingredient = state.ingredients[action.payload.index];
      const updatedIngredient = {
        ...ingredient, // copy old data
        ...action.payload.ingredient, // overwrite with new data
      };
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[action.payload.index] = updatedIngredient;
      return {
        ...state,
        ingredients: updatedIngredients,
      };
    case ShoppingListActions.DELETE_INGREDIENTS:
      return {
        ...state,
        ingredients: state.ingredients.filter(
          (_ingredient: Ingredient, index: number) => {
            return index !== action.payload;
          }
        ),
      };
    ...;
  }
}
```

In `shopping-edit.component.ts`

- Modify methods to dispatch Actions correctly

```ts
@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  onSubmit(formElement: NgForm) {
    ...;
    if (this.editMode) {
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredients({
          index: this.editedItemIndex,
          ingredient: newIngredient,
        })
      );
    } else {
      ...;
    }
    ...;
  }
  onDelete() {
    this.store.dispatch(
      new ShoppingListActions.DeleteIngredients(this.editedItemIndex)
    );
    ...;
  }
}
```

Note there is a bug where the page is displaying outdated states when editing an ingredient. This will be addressed in later lessons.

### Lesson 356 - Expanding the State

In `shopping-list.reducer.ts`

- Define an interface that describes the `State`
- Define an interface that describes the `AppState`
  - This is used when the `Store` is injected into other components

```ts
export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

export interface AppState {
  shoppingList: State;
}

const initialState: State = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};
```

In `recipe.service.ts`, `shopping-edit.component.ts` and `shopping-list.component.ts`

- Use the `AppState` to replace the hard-coded type parameter when injecting the `Store`

```ts
import * as fromShoppingList from '.../shopping-list.reducer';

@Injectable({ ... })
export class RecipeService {
  constructor(private store: Store<fromShoppingList.AppState>) {}
}
```
