# Section 24 Working with NgRx

## NgRx

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
