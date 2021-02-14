# Section 16 Course Project - Forms

## Course Project

### Lesson 217 - Introduction

Goal: Use FormsModule to implement forms in

- ShoppingList - Template Driven Approach
- EditRecipes - Reactive Approach

### Lesson 218 - TD: Adding the Shopping List Form

Goal: Use TD approach to update the form in the shopping list edit component

In `shopping-edit.component.html`

- Remove local references for inputs
- Add event binding `ngSubmit`
- Add local reference for form and assign it `ngForm`
- Add `name` for input fields
- Register input fields as control using `ngModel`

In `shopping-edit.component.ts`

- Update `onAddItem` to take in the `NgForm` object
- Update logic to get the values using `NgForm.value`

### Lesson 219 - Adding Validation to the Form

Goal: Add required validation to both fields, make sure the number field is a positive number, and disable the add button if the form is invalid

In `shopping-edit.component.html`

- Add `required` property to input fields
- Add `[pattern]="'^[1-9]+[0-9]*$'"`
  - `pattern` is a built-in validator that validates the field base on the regex value it is provided with
- Add `[disabled]="!formElement.valid"`

### Lesson 220 - Allowing the Selection of Items in the List

Goal: Select an item in the shopping list and be able to edit it.

In `shopping-list.service.ts`

- Add `startedEditing` subject to emit editing index on item being edited

In `shopping-edit.component.ts`

- Subscribe to `ShoppingListService.startedEditing` and update index and edit mode on event emitted
- Clean up subscription on destroy

In `shopping-list.component.html`

- Add click listener on list items and pass in the index

In `shopping-list.component.ts`

- Emit the `ShoppingListService.startedEditing` when a list item is clicked

### Lesson 221 - Loading the Shopping List Items into the Form

Goal: On selecting a list item, load it into the edit form

In `shopping-list.service.ts`

- Add a `getIngredient(index)` method to get the ingredient object base on the index

In `shopping-edit.component.ts`

- Set the `editedItem` ingredient on receiving the emitted event
- Use the form reference to set the value of the form base on the `editedItem` using `NgForm.setValue()`

### Lesson 222 - Updating existing Items

Goal: Make editing an item functional and make sure to edit instead of add a new item

In `shopping-edit.component.html`

- Use the `editMode` to generate the text on the button using string interpolation

In `shopping-list.service.ts`

- Add a `updateIngredient(index, newIngredient)` method to update the ingredient of index, and emit a `ingredientsChanged` event

In `shopping-edit.component.ts`

- Call `ShoppingListService.updateIngredient()` if the mode is in edit
- Call `ShoppingListService.addIngredient()` if the mode is not in edit

### Lesson 223 - Resetting the Form

Goal: Reset the form when the Add/Update button is clicked

In `shopping-edit.component.ts`

- Switch `editMode` off once the Add/Update button is clicked
- Add `NgForm.reset()`

### Lesson 224 - Allowing the the User to Clear (Cancel) the Form

Goal: Clear the form when the clear button is clicked

In `shopping-edit.component.html`

- Add a click listener on the clear button

In `shopping-edit.component.ts`

- In the `onClear` method, clear the form and reset the `editMode` when the button is clicked
