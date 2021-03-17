# Section 26 Angular Animations

## Angular Animations

### Lesson 403 - Making Animations Work with Angular 4+

Some changes that need to be made in the following lessons

- Install the new animations package
  - `npm install --save @angular/animations`
- Add the `BrowserAnimationsModule` to the `imports[]` array in `AppModule`
- This Module needs to be imported from `@angular/platform-browser/animations`
  - `import { BrowserAnimationsModule } from '@angular/platform-browser/animations`
- Import `trigger`, `state`, `style`, etc from `@angular/animations` instead of `@angular/core`

### Lesson 404 - Introduction

Angular provides Animations features to make rendering more smoothly and customized.

### Lesson 405 - Setting up the Starting Project

See [section26-app](./section26-app/)

### Lesson 406 - Animations Triggers and State

In `app.component.ts`

- Use the `animations` property in the `@Component` decorator to set up the Angular Animations
- The `animations` property takes in a list of **Triggers**
  - Triggers are animation metadata containing
    - The name of the trigger
    - The **States** of the trigger
    - The **Transitions** of the trigger
  - The Trigger is defined using the `trigger()` method, which takes in 2 arguments
    - The name of the trigger (string)
    - A list of State or Transitions
  - The State is defined using the `state()` method, which takes in 2 arguments
    - The name of the state (string)
    - The Animation Style Metadata, which is an object that contains CSS styling
- Declare a property that represents the state of the target HTML element and assign it with an initial state

```ts
@Component({
  ...,
  animations: [
    trigger('divState', [
      state(
        'normal',
        style({
          backgroundColor: 'red',
          transform: 'translateX(0)',
        })
      ),
      state(
        'highlighted',
        style({
          backgroundColor: 'blue',
          transform: 'translateX(100px)',
        })
      ),
    ]),
  ],
})
export class AppComponent {
  state = 'normal';
  ...;
}
```

In `app.component.html`

- Define a div of a square using CSS styling
- Use `[@triggerName]="stateName"` to
  - Define the Trigger name (`[@divState]`)
  - Property bind the trigger name to the State or state variable name (`state`)

```html
<div style="width: 100px; height: 100px;" [@divState]="state"></div>
```

In the application page, there will be a red square that contains both the div styles and the state that is declared in the TS file.

### Lesson 407 - Switching between States

To switch the state, simply change the state bound to the animation trigger name, and property binding will pick up the change and invoke the correct trigger.

In `app.component.ts`

- Create the `onAnimate()` method that toggles the state between `'normal'` and `highlighted`

```ts
@Component({ ... })
export class AppComponent {
  onAnimate() {
    this.state === 'normal'
      ? (this.state = 'highlighted')
      : (this.state = 'normal');
  }
  ...
}
```

In `app.component.html`

- Event bind the `onAnimate()` method to the click event to the Animate button

```html
<button class="btn btn-primary" (click)="onAnimate()">Animate!</button>
```

### Lesson 408 - Transitions

In `app.component.ts`

- Use the `transition()` function to define the transition between states
  - The first argument is the state transition as string
    - The format is `state1 => state2`
  - The second argument is the steps of the transition
    - For now it will be `animate()` method, which transitions the styles using a even gradient
      - It takes in a number as the amount of time (ms) the transition should take place for

```ts
@Component({
  animations: [
    trigger('divState', [
      state(...),
      state(...),
      transition('normal => highlighted', animate(300)),
      transition('highlighted => normal', animate(300)),
    ]),
  ],
})
export class AppComponent {
  ...
}
```
