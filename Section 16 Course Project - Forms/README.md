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
