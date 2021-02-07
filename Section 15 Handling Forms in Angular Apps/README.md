# Section 15 Handling Forms in Angular Apps

## Forms Module

### Lesson 181 - Module Introduction

Angular helps submit forms in the HTML page. Since Angular apps are single-paged applications, in order to submit a form, we need to use Angular's HTTP Service. In addition to that, Angular also provides features such as pre-processing, checking and adding styling forms elements.

### Lesson 182 - Why do we Need Angular's Help

Angular's forms module can convert HTML form label and input to JS/TS objects. Through this, it allows additional features such as input validation.

### Lesson 183. Template-Driven (TD) vs Reactive Approach

Angular offers 2 approaches to handle forms

- Template Driven (TD)
  - Set up the form in HTML template
  - Angular infers the form structure
  - Less complex, but less control
- Reactive
  - Set up the form programmatically in TS and HTML code
  - Connect the TS and HTML code manually
  - More complex, but more control

## Template Driven (TD)

The app for the following section can be found in [section15-app-templateDriven](./section15-app-templateDriven).

### Lesson 184 - An Example Form

The form is defined in `app.component.html`. Note that in the `<form>` tag, there is no `action` or `method` attributes. The reason for this is that we don't want this form to be submitted to a server. Instead, Angular should handle this for us.

### Lesson 185 - TD: Creating the Form and Registering the Controls

To have Angular create a form object in a Template Driven approach

In `app.module.ts`, import `FormsModule`

```ts
import { ... } from '...';

@NgModule({
  ...,
  imports: [..., FormsModule],
})
export class AppModule {}
```

In the component's html template, Angular uses the `<form>` as a selector to construct the object representing the form. To register controls to elements (e.g. `<input>`) in the form, we need to

- Add Angular attribute `ngModel` to the tags. This tells Angular that the tag is a control of the form.
  - Recall that to use two-way-binding, we needed to add `[(ngModel)]`
  - In this case, to register the element as a control, the square brackets and parentheses are not needed
- Add HTML attribute `name` to the tag, so Angular knows the name of or reference to the control.

In `app.component.html`

```html
<form>
  <div class="form-group">
    <label for="username">Username</label>
    <input
      type="text"
      id="username"
      class="form-control"
      ngModel
      name="username"
    />
  </div>
  <label for="secret">Secret Questions</label>
  <select id="secret" class="form-control" ngModel name="secret">
    <option value="pet">Your first Pet?</option>
    <option value="teacher">Your first teacher?</option>
  </select>
</form>
```

### Lesson 186 - TD: Submitting and Using the Form

To submit a form, it is easy to consider adding a eventListener on the button of type `submit` (e.g. `<button type="submit">Submit</button>`). However, this is not the best way do it. By clicking on the button, it triggers the default HTML behavior, which submits the request as well as emits a JS form submit event built into JS/HTML.

Angular provides a wrapper directive that utilizes this JS event. By putting `(ngSubmit)` event listener in the `<form>` tag, the event bound to it will be triggered whenever the default JS form submit event is triggered.

Using the Template Driven approach, we need to access the form data object through the template. To do so, use a local reference and assign it to `"ngForm"`. A local reference returns the form elements as HTML, but assigning it to the ngForm directive returns the JS object Angular constructs base on the controls we define.

In `app.component.html`

```html
<form (ngSubmit)="onSubmit(formElement)" #formElement="ngForm">...</form>
```

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent {
  ...
  onSubmit(formElement: NgForm): void {
    console.log(formElement);
  }
}
```

### Lesson 187 - TD: Understanding Form State

The `NgForm` object created by Angular has some very useful fields.

- `controls` is an object of key value pairs. Each pair is a element that we registered as control using `ngModel`, where the key is the `name`, and the value is the `FormControl` object
- `dirty` is a boolean. It returns true if the form has been edited, and false otherwise.
- `disabled` is a boolean. It returns true if the submit button is disabled, and false if it is enabled.
- `invalid` is a boolean. If there are no validators registered, it returns false by default. If there are registered validators, it returns true if the all fields are valid.
- `touched` is a boolean. It returns true if the user clicks into one of the fields.

### Lesson 188 - TD: Accessing the Form with @ViewChild

It is also possible to access the form object through `@ViewChild`. Recall that `@ViewChild` allows TS code to access a local reference defined in the HTML template.

Compared to accessing form using only the local reference and the `(ngSubmit)` event listener, `@ViewChild` allows the code to access the form object before submission.

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent {
  @ViewChild('formElement')
  signUpForm: NgForm;

  onSubmit(): void {
    console.log(this.signUpForm);
  }
}
```

### Lesson 189 - TD: Adding Validation to check User Input

Sometimes it is desired to validate the input fields in the form. For example, we may want all fields to be non-empty, and the value in the email field to be of a valid email format.

In a TD approach, validators are added in the HTML template. Some Angular built-in validator selectors include `required` and `email`.

Validators control several locations

- `NgForm.valid` - form-level valid field.
  - Set to true if all fields are valid.
  - Set to false if any of the fields are invalid.
- `NgForm.controls.field.valid` - field level valid field.
  - Set to true if the corresponding validator returns true.
  - Set to false if the corresponding validator returns false.
- The HTML element's `class`.
  - Appends `ng-valid` if the field is valid.
  - Appends `ng-invalid` if the field is invalid.
  - We can use these classes to style the field to provide a more straightforward feedback

In `app.component.html`

```html
<form (ngSubmit)="onSubmit(formElement)" #formElement="ngForm">
  <label for="username">Username</label>
  <input
    type="text"
    id="username"
    class="form-control"
    ngModel
    name="username"
    required
  />
  <label for="email">Mail</label>
  <input
    type="email"
    id="email"
    class="form-control"
    ngModel
    name="email"
    required
    email
  />
</form>
```

### Lesson 190 - Built-in Validators & Using HTML5 Validation

Some Angular built-in validators can be found on Angular's [Validator Documentation Page](https://angular.io/api/forms/Validators)

By default, Angular disables HTML5's native validation. To enable it, add `ngNativeValidate` directive to a control in the template.
