# Section 3 Course Project - The Basics

## Course Project

### Lesson 43 - Project Introduction

Goal: build a shopping list and recipe project.

### Lesson 44 - Planning the Application

Goal: decide what components to use base on the features.

### Lesson 45 - Installing Bootstrap Correctly

In the terminal

```sh
npm install --save bootstrap@3
```

make sure `"node_modules/bootstrap/dist/css/bootstrap.min.css"` is in the `styles` list in `angular.json`

### Lesson 46 - Setting up the application

In terminal

```sh
npm install
ng serve
```

### Lesson 47 - Creating the Components

To create a component, use `ng generate component <componentName>`.

This creates the bellow files and adds this to the AppModules declarations

- componentName.component.ts
- componentName.component.spec.ts
- componentName.component.html
- componentName.component.css

### Lesson 48 - Using the Components

Adjust the component html files to include nested components.

### Lesson 49 - Adding a Navigation Bar

See `header.component.html` for nav bar.

### Lesson 50 - Alternative Non-Collapsible Navigation Bar

### Lesson 51 - Creating a "Recipe" Model

A model is simply a TS class. Add a model to the project by adding a `modelName.model.ts` file. In this case, `Recipe.model.ts`.

### Lesson 52 - Adding Content to the Recipe Component

See `recipes-list.component.html` for recipe list.

### Lesson 53 - Outputting a List of Recipes with ngFor

Use `*ngFor` to populate the Recipes from the recipes list.

To set the `src` attribute in `<img>`, we can either use

- String Interpolation - `<img src="{{ recipe.imagePath }}">`
- Property Binding - `<img [src]="recipe.imagePath">`

### Lesson 54 - Displaying Recipe Details

See `recipes-detail.component.html` for recipe detail.

For now, the data cannot be populated in the detail section because it needs cross-component communication. Will be done after Section 4.

### Lesson 55 - Working on the ShoppingListComponent

See `shopping-list.component.html` for shopping list.

### Lesson 56 - Creating an "Ingredient" Model

Use a `shared` folder for features or elements that are shared between different components.

See `Ingredient.model.ts` for the Ingredient Model.

For TS POJO-like models, the following two classes are equivalent

```ts
export class Ingredient {
  constructor(public name: string, public amount: number) {}
}

export class Ingredient {
  public name: string;
  public amount: number;
  constructor(name: string, amount: number) {
    this.name = name;
    this.amount = amount;
  }
}
```

### Lesson 57 - Creating and Outputting the Shopping List

See `shopping-list.component.html` for the shopping list

### Lesson 58 - Adding a Shopping List Edit Section

See `shopping-edit.component.html` for the shopping edit component

### Lesson 59 - Wrap Up & Next Steps

To allow communication between components, we need to dive deeper into components and data binding.
