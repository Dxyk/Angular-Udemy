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

### Lesson 191 - TD: Using the Form State

We can control the form bases on its state. Some examples are

- Setting the submit button as disabled if any of the fields are invalid.
- Adding Styling base on the validity of the field

In `app.component.html`

- Using property binding, Set `disabled` if the `formElement` (local reference) is invalid

```html
<form (ngSubmit)="onSubmit(formElement)" #formElement="ngForm">
  <button class="btn btn-primary" type="submit" [disabled]="!formElement.valid">
    Submit
  </button>
</form>
```

In `app.component.css`

- Add a red boarder to the input fields if the field is touched (clicked into) and invalid.

```css
input.ng-invalid.ng-touched {
  border: 1px solid red;
}
```

One remaining problem: How do we retrieve the state of the form and its controls in TS code?

### Lesson 192 - TD: Outputting Validation Error Messages

To access the state of the form and its controls in TS code, use local references in HTML.

- To access the form, add a local reference and assign it to `ngForm`
  - `<form #formElement="ngForm">`
- To access the form control, add a local reference and assign it to `ngModel`
  - `<input #field="ngModel">`

In `app.component.html`

- Show a help-block prompt if the user has touched the email field and the email field is invalid

```html
<form (ngSubmit)="onSubmit(formElement)" #formElement="ngForm">
  <label for="email">Mail</label>
  <input
    type="email"
    id="email"
    class="form-control"
    ngModel
    name="email"
    required
    email
    #email="ngModel"
  />
  <span class="help-block" *ngIf="email.touched && !email.valid">
    Please enter a valid email!
  </span>
</form>
```

### Lesson 193 - TD: Set Default Values with ngModel Property Binding

To set a default value for a control field, use property binding with the `ngModel` directive. Note that previously, to register a field as control, the `ngModel` was added as a property only (without the square brackets `[]`)

In `app.component.html`

```html
<form (ngSubmit)="onSubmit(formElement)" #formElement="ngForm">
  <select
    id="secret"
    class="form-control"
    [ngModel]="defaultQuestion"
    name="secret"
  >
    <option value="pet">Your first Pet?</option>
    <option value="teacher">Your first teacher?</option>
  </select>
</form>
```

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent {
  ...
  defaultQuestion = 'pet';
  ...
}
```

### Lesson 194 - TD: Using ngModel with Two-Way-Binding

Two-Way-Binding with `ngModel` on a field not only allows us to populate a default value, but also allow us to track the change of value.

In `app.component.html`

```html
<form (ngSubmit)="onSubmit(formElement)" #formElement="ngForm">
  <div class="form-group">
    <textarea
      name="questionAnswer"
      rows="3"
      class="form-control"
      [(ngModel)]="answer"
    ></textarea>
    <p>Your reply: {{ answer }}</p>
  </div>
</form>
```

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent {
  ...
  answer = '';
  ...
}
```

Three uses of `ngModel`

- No binding (`ngModel`)
  - Only tells Angular that a field is a control
- One-Way-Binding (`[ngModel]`)
  - Set the default value for the control
- Two-Way-Binding (`[(ngModel)]`)
  - Set the default value, and be able to react to the value of the control

### Lesson 195 - TD: Grouping Form Controls

To gain some structure for in the JS form object, we may wish to group some fields. E.g. We may wish to group the question dropdown and the answer text area together since they are related.

To do so, use the `ngModelGroup` selector and assign a groupName as its value.

The `ngModelGroup` will

- Create a separate object in the `NgForm.value` object with the group name

  ```ts
  NgForm = {
    value: {
      groupName: {
        field1: 'value',
        field2: 'value',
      },
    },
  };
  ```

- Create a separate object in the `NgForm.controls` object with the groupName

  ```ts
  NgForm = {
    controls: {
      groupName: {
        controls: {
          field1Control: {...},
          field2Control: {...}
        }
      }
    }
  }
  ```

- Create Angular generated classes on the group wrapper.
  - `ng-dirty`, `ng-touched`, `ng-valid` etc.

With a local reference that is assigned to `"ngModelGroup"`, it is also possible to access it in the template or in TS code.

In `app.component.html`

```html
<form (ngSubmit)="onSubmit(formElement)" #formElement="ngForm">
  <div id="user-data" ngModelGroup="userData" #userDataGroup="ngModelGroup">
    <div class="form-group">
      <label for="username">Username</label>
      <input
        type="text"
        id="username"
        class="form-control"
        ngModel
        name="username"
        required
      />
    </div>
    <div class="form-group">
      <label for="email">Mail</label>
      <input
        type="email"
        id="email"
        class="form-control"
        ngModel
        name="email"
        required
        email
        #email="ngModel"
      />
      <span class="help-block" *ngIf="email.touched && !email.valid">
        Please enter a valid email!
      </span>
    </div>
  </div>
  <span
    class="help-block"
    *ngIf="userDataGroup.touched && !userDataGroup.valid"
  >
    User data Invalid
  </span>
</form>
```

### Lesson 196 - TD: Handling Radio Buttons

Radio buttons may look like a special case since they do not have input fields, but in a TD approach, they work just like any other fields.

In `app.component.html`

```html
<form (ngSubmit)="onSubmit(formElement)" #formElement="ngForm">
  <div class="radio" *ngFor="let gender of genders">
    <label>
      <input type="radio" name="gender" ngModel [value]="gender" />{{ gender }}
    </label>
  </div>
</form>
```

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent {
  ...
  genders = ['male', 'female'];
  ...
}
```

### Lesson 197 - TD: Setting and Patching Form Values

It is possible to set or patch the form values programmatically through TS code.

To access the form, use the form's local reference as `NgForm`, access it in TS code using `@ViewChild`.

To set the value of the form, there are 2 ways

1. Use `NgForm.setValue()` method and pass in the exact copy of the entire form object
   1. This method sets the values of all controls with one command
   2. It will override all existing values for all fields
2. Use `NgForm.form.patchValue()` method to patch the form with only the fields provided in the input object
   1. This method sets the values of only the provided controls
   2. It will not modify existing values for other fields

In `app.component.html`

```html
<form (ngSubmit)="onSubmit(formElement)" #formElement="ngForm">
  <button class="btn btn-default" type="button" (click)="suggestUserName()">
    Suggest an Username
  </button>
</form>
```

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent {
  ...
  suggestUserName(): void {
    const suggestedName = 'Superuser';
    // this.signUpForm.setValue({
    //   userData: {
    //     username: suggestedName,
    //     email: ''
    //   },
    //   secret: 'pet',
    //   questionAnswer: '',
    //   gender: 'male'
    // });
    this.signUpForm.form.patchValue({
      userData: {
        username: suggestedName
      }
    });
  }
  ...
}
```

### Lesson 198 - 199. TD: Using Form Data

To use or persist the data in the form, create a separate object in the TS code, and copy all the field values using `NgForm.value` when desired (e.g. on submit).

In `app.component.html`

```html
<hr />
<div class="row" *ngIf="submitted">
  <div class="col-xs-12">
    <h3>Your Data</h3>
    <p>User Name: {{user.username}}</p>
    <p>Email Address: {{user.email}}</p>
    <p>Secret Question: {{user.secretQuestion}}</p>
    <p>Secret Answer: {{user.secretAnswer}}</p>
    <p>Gender: {{user.gender}}</p>
  </div>
</div>
```

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent {
  ...
  submitted = false;
  user = {
    username: '',
    email: '',
    secretQuestion: '',
    secretAnswer: '',
    gender: '',
  };
  ...
  onSubmit(): void {
    this.submitted = true;
    this.user.username = this.signUpForm.value.userData.username;
    this.user.email = this.signUpForm.value.userData.email;
    this.user.secretQuestion = this.signUpForm.value.secret;
    this.user.secretAnswer = this.signUpForm.value.questionAnswer;
    this.user.gender = this.signUpForm.value.gender;
  }
}
```

### Lesson 199 - TD: Resetting Forms

To reset the value and state of the form, use `NgForm.reset()`. Note that this will not only reset the value in the form, but also the state of the form. E.g. the ng classes will be reset as well.

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent {
  ...
  onSubmit(): void {
    ...
    this.signUpForm.reset();
  }
}
```

## Assignment 6

See [assignment-6](./assignment-6)

## Reactive Approach

### Lesson 201 - Introduction to the Reactive Approach

Compared to the Template Driven Approach, the Reactive Approach

- Allows the form to be created with more detail
- Allows custom Validators
- Creates the form programmatically through TS code

### Lesson 202 - Reactive: Setup

In the Reactive Approach, `FormModule` is no longer needed to be imported in `app.module.ts`. Instead, import `ReactiveFormsModule`.

Angular creates forms programmatically in the TS code using the `FormGroup` object. In Angular, a form is represented as a group of controls, thus the class name.

In `app.module.ts`

```ts
import { ... } from '...';

@NgModule({
  ...,
  imports: [BrowserModule, ReactiveFormsModule],
  ...
})
export class AppModule {}
```

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent {
  ...
  signUpForm: FormGroup;
}
```

### Lesson 203 - Reactive: Creating a Form in Code

Creating a form using the code will require the form to be created before the template is rendered, so it is common to initialize the form object in the `ngOnInit()` method.

The `FormGroup` constructor takes in a JS object that represents the group. Note that the keys should be of type string, so when the code is minified, the key values are kept.

If the key in the `FormGroup` is the name of the a form control, the value will be the `FormControl`. The `FormControl` constructor will take in 3 arguments

1. The initial state of the control
   1. `null` - empty string
   2. Any string
2. Validator(s) for the control
3. Asynchronous validator(s) for the control

Note that no matter what type of input (input, radio, selector, etc), Angular treats them the same, all as `FormControl`

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent implements OnInit {
  ...
  signUpForm: FormGroup;

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      username: new FormControl(null),
      email: new FormControl(null),
      gender: new FormControl('male'),
    });
  }
}
```

### Lecture 204 - Reactive: Syncing HTML and Form

For the reactive approach to work, we need to use the `[formGroup]` to let Angular know which `<form>` element correspond to which `FormGroup` object.

To let Angular know which HTML field correspond to which FormControl, use the `formControlName` directive. Note this can be done through either setting the property or property binding. To set the property, use `formControlName="nameString"`, and to use property binding, use `[formControlName]="'nameString'"`.

With the previous `FormGroup` set up in `app.component.ts`, in `app.component.html`

```html
<form [formGroup]="signUpForm">
  ...
  <input
    type="text"
    id="username"
    formControlName="username"
    class="form-control"
  />
  ...
  <input type="text" id="email" formControlName="email" class="form-control" />
  ...
  <input type="radio" formControlName="gender" [value]="gender" />{{ gender }}
</form>
```

### Lecture 205 - Reactive: Submitting the Form

To submit the form, similar to the Template Driven approach, use event binding on `(ngSubmit)`. The difference is that in the Reactive approach, we do not reference the local reference of the form, because we are no longer using Angular's auto-creation mechanism. To reference the form, simply use the `FormGroup` object created in the TS code.

In `app.component.html`

```html
<form [formGroup]="signUpForm" (ngSubmit)="onSubmit()">...</form>
```

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent implements OnInit {
  ...
  onSubmit(): void {
    console.log(this.signUpForm);
  }
}
```

### Lecture 206 - Reactive: Adding Validation

In the Reactive approach, all form configurations happen in the TS code, including validation.

The second input in the `FormControl` constructor specifies a single or a list of validator(s). These should be method references. The `Validators` object also includes some convenient built-in validator methods such as `required`,

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent implements OnInit {
  ...
  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      gender: new FormControl('male'),
    });
  }
}
```

### Lesson 207 - Reactive: Getting Access to Controls

To access the controls defined in the TS code and their states in HTML, use the form object's `FormGroup.get()` method. The method takes in either the name or the path of the control .

In `app.component.html`

```html
<span
  *ngIf="signUpForm.get('email').touched && !signUpForm.get('email').valid"
  class="help-block"
>
  Please enter a valid email!
</span>
<span *ngIf="signUpForm.touched && !signUpForm.valid" class="help-block">
  Please enter valid data!
</span>
```

### Lesson 208 - Reactive: Grouping Controls

The `FormGroup` object can be nested to achieve group controls.

In `app.component.html`

- Use a `<div formGroupName="groupName"></div>` to wrap around the control fields that need to be grouped
- Update all existing `FormGroup.get()` to access the control through a path. The path is the `FormGroup`s and `FormControl` concatenated by a dot `.`

```html
<div formGroupName="userData">
  <div class="form-group">
    ...
    <span
      *ngIf="signUpForm.get('userData.username').touched && !signUpForm.get('userData.username').valid"
      class="help-block"
    >
      Please enter a valid username!
    </span>
  </div>
  <div class="form-group">
    ...
    <span
      *ngIf="signUpForm.get('userData.email').touched && !signUpForm.get('userData.email').valid"
      class="help-block"
    >
      Please enter a valid email!
    </span>
  </div>
</div>
```

In `app.component.ts`

- Add a new `FormGroup` object in the JS form object, and update the controls that should be grouped

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent implements OnInit {
  ...
  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      userData: new FormGroup({
        username: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
      }),
      gender: new FormControl('male'),
    });
  }
}
```

### Lesson 209 - Fixing a Bug

### Lesson 210 - Reactive: Arrays of Form Controls (FormArray)

It is also possible to have an array of form controls in the form with the Reactive approach.

In `app.component.html`

- Use `<div formArrayName=""></div>` to wrap around the `FormArray`
- Use `*ngFor` to iterate on `FormArray.controls`

```html
<div formArrayName="hobbies">
  <h4>Your hobbies:</h4>
  <button class="btn btn-default" type="button" (click)="onAddHobby()">
    Add Hobby
  </button>
  <div
    class="form-group"
    *ngFor="let hobbyControl of getControls(); let i = index"
  >
    <input type="text" class="form-control" [formControlName]="i" />
  </div>
</div>
```

In `app.component.ts`

- The constructor of `FormArray` takes in an array of `FormControl`s
- Use `FormArray.push()` to append more controls to the array

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent implements OnInit {
  signUpForm: FormGroup;

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      ...,
      hobbies: new FormArray([]),
    });
  }

  getControls(): AbstractControl[] {
    return (<FormArray>this.signUpForm.get('hobbies')).controls;
  }

  onAddHobby(): void {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signUpForm.get('hobbies')).push(control);
  }
```

### Lesson 211 - Reactive: Creating Custom Validators

A custom validator is a TS method that follows a specific signature.

In `app.component.ts`

- The validator method must take in a `FormControl` object
- If validation passes, the validator method must return `null`
- If validation fails, the validator must return an error object of form `{ [s: string]: boolean }`
  - The key will be the description of the error object
  - The value must be true, indicating the error occurred
- To add the custom validator to the form control, append it to the `Validator[]` list
  - Note that when Angular calls the custom validator, the `this` object will not be `AppComponent`, so it is necessary to add `.bind(this)` to bind the method to the component.

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent implements OnInit {
  ...
  forbiddenUsernames = ['admin', 'staff'];
  signUpForm: FormGroup;

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      userData: new FormGroup({
        username: new FormControl(null, [
          Validators.required,
          this.forbiddenNames.bind(this),
        ]),
        ...
      }),
      ...
    });
  }

  forbiddenNames(control: FormControl): { [s: string]: boolean } {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return { nameIsForbidden: true };
    }
    return null;
  }
  ...
}
```

### Lesson 212 - Reactive: Using Error Codes

If a control's value is invalid because of its validators, the `FormControl.errors` object will be set. By checking if the error corresponding to the error name exists, we can fine-tune the error message.

In `app.component.html`

````html
<span
  *ngIf="signUpForm.get('userData.username').touched && !signUpForm.get('userData.username').valid"
  class="help-block"
>
  <span *ngIf="signUpForm.get('userData.username').errors['nameIsForbidden']">
    This name is invalid!
  </span>
  <span *ngIf="signUpForm.get('userData.username').errors['required']">
    This field is required!
  </span>
</span>
```
````
