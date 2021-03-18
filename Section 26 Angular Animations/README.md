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
  - The `@` sign informs Angular that the variable is animation related
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

### Lesson 409 - Advanced Transitions

The `transition()` method's first argument takes in a string expression of the state change. One example would be `'normal <=> highlighted'`. This means the transition between the two states have the same animation.

Transition also allow control of the styling during the transition.

In `app.component.ts`

- Use `'state1 <=> state2'` in the `transition()` state expression to indicate the transitions between the two state have the same effect
- Add another Trigger for `wildState`
  - Define the previous two states and add `transform: scale(1)` to them
  - Define a new state that shrinks the element
  - Define the previous two transitions
  - Use `'shrunken <=> *'` to define a new transition from `shrunken` state to any state (`*` wildcard) and vice versa
- Add logic to `onAnimate` to toggle the `wildState` between `normal` and `highlighted` (same as before)
- Add `onShrink()` method to set the `wildState` to `'shrunken'`

```ts
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    trigger('divState', [
      state(...),
      state(...),
      transition('normal <=> highlighted', animate(300)),
    ]),
    trigger('wildState', [
      state(
        'normal',
        style({
          backgroundColor: 'red',
          transform: 'translateX(0) scale(1)',
        })
      ),
      state(
        'highlighted',
        style({
          backgroundColor: 'blue',
          transform: 'translateX(100px) scale(1)',
        })
      ),
      state(
        'shrunken',
        style({
          backgroundColor: 'green',
          transform: 'translateX(0) scale(0.5)',
        })
      ),
      transition('normal => highlighted', animate(300)),
      transition('highlighted => normal', animate(800)),
      transition('shrunken <=> *', animate(500)),
    ]),
  ],
})
export class AppComponent {
  wildState = 'normal';
  onAnimate() {
    ...;
    this.wildState === 'normal'
      ? (this.wildState = 'highlighted')
      : (this.wildState = 'normal');
  }
  onShrink() {
    this.wildState = 'shrunken';
  }
  ...
}
```

In `app.component.html`

- Use event binding to bind the `onShrink()` method to the Shrink button
- Add a new div and use property binding to bind the `wildState` trigger to the `wildState` property

```html
<button class="btn btn-primary" (click)="onShrink()">Shrink!</button>
<div style="width: 100px; height: 100px;" [@wildState]="wildState"></div>
```

### Lesson 410 - Transition Phases

In `app.component.ts`

- Pass in a list of `style()` and `animate()` methods as the second argument for the `trigger()` method
  - If the method is `style()`, the style is set instantly
  - If the method is `animate()`, the second optional argument can be a `style()` method that defines the style the transformation animation should be like
  - It is important to have `animate()` at the end to transform smoothly to the end state

```ts
@Component({
  ...,
  animations: [
    trigger('divState', [...]),
    trigger('wildState', [
      ...,
      transition('shrunken <=> *', [
        style({
          borderRadius: '0',
          backgroundColor: 'orange',
        }),
        animate(
          1000,
          style({
            borderRadius: '50px',
          })
        ),
        animate(500),
      ]),
    ]),
  ],
})
export class AppComponent { ... }
```

### Lesson 411 - The "void" State

In `app.component.ts`

- Add a new trigger for `list1`
  - Define an initial state of name `in`, and opacity of 1 and steady position
  - Add a transition of `void => *` for adding an item to the list
    - `void` is a reserved state from Angular that indicates the element does not exist in the DOM
    - This transition starts from the left and opacity of 0 (transparent)
    - Use `animate()` to define the duration of this transition
  - Add a transition of `* => void` for removing an item from the list
    - This transition does not have a start state
    - Use `animation()` to define the duration and the style for the animation to move to the right and make the element transparent

```ts
@Component({
  ...,
  animations: [
    trigger('divState', [...]),
    trigger('wildState', [...]),
    trigger('list1', [
      state(
        'in',
        style({
          opacity: 1,
          transform: 'translateX(0)',
        })
      ),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100px)',
        }),
        animate(300),
      ]),
      transition('* => void', [
        animate(
          300,
          style({
            transform: 'translateX(100px)',
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class AppComponent { ... }
```

In `app.component.html`

- Add the `[@list1]` trigger, but do not bind it to any other property because it does not need to have an initial state. The initial state is defined in the trigger

```html
<li
  class="list-group-item"
  (click)="onDelete(item)"
  [@list1]
  *ngFor="let item of list"
>
  {{ item }}
</li>
```

### Lesson 412 - Using Keyframes for Animations

In `app.component.ts`

- Add another trigger for `list2`
  - Keep initial state the same as in `list1`
  - When adding an item, pass in a `keyframes()` method that segments the duration into either equal parts or base on offsets defined in the `style()` methods in the second argument
    - The `style()` methods in `keyframes()` defines the goal style for the transition
      - The object can contain an `offset` parameter that determines the % of the keyframe for the style

```ts
@Component({
  ...,
  animations: [
    trigger('divState', [...]),
    trigger('wildState', [...]),
    trigger('list1', [...]),
    trigger('list2', [
      state(
        'in',
        style({
          opacity: 1,
          transform: 'translateX(0)',
        })
      ),
      transition('void => *', [
        animate(
          1000,
          keyframes([
            style({
              transform: 'translateX(-100px)',
              opacity: 0,
              offset: 0,
            }),
            style({
              transform: 'translateX(-50px)',
              opacity: 0.5,
              offset: 0.3,
            }),
            style({
              transform: 'translateX(-20px)',
              opacity: 1,
              offset: 0.8,
            }),
            style({
              transform: 'translateX(0px)',
              opacity: 1,
              offset: 1,
            }),
          ])
        ),
      ]),
      transition('* => void', [
        animate(
          300,
          style({
            transform: 'translateX(100px)',
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class AppComponent { ... }
```

In `app.component.html`

- Add the `[@list2]` trigger, but do not bind it to any other property because it does not need to have an initial state. The initial state is defined in the trigger

```html
<li
  class="list-group-item"
  (click)="onDelete(item)"
  [@list2]
  *ngFor="let item of list"
>
  {{ item }}
</li>
```

### Lesson 413 - Grouping Transitions

In `app.component.ts`

- Use `group()` to group two animations together
  - The `group` method allows grouping of animations so that they happen at the same time (asynchronously), but don't necessarily have to finish at the same time

```ts
@Component({
  ...,
  animations: [
    trigger('divState', [...]),
    trigger('wildState', [...]),
    trigger('list1', [...]),
    trigger('list2', [
      state(...),
      transition('void => *', [...]),
      transition('* => void', [
        group([
          animate(
            800,
            style({
              transform: 'translateX(100px)',
              opacity: 0,
            })
          ),
          animate(
            300,
            style({
              color: 'red',
            })
          ),
        ]),
      ]),
    ]),
  ],
})
export class AppComponent { ... }
```

### Lesson 414 - Using Animation Callbacks

It is possible to execute code after the animation started or finished

In `app.component.ts`

- Create `animationStarted()` and `animationEnded()` to log the events

```ts
@Component({ ... })
export class AppComponent {
  ...
  animationStarted(event) {
    console.log(event);
  }
  animationEnded(event) {
    console.log(event);
  }
}
```

In `app.component.html`

- Use event binding to listen to `@triggerName.start` and `@triggerName.done` to fire events and execute code

```html
<div
  style="width: 100px; height: 100px;"
  [@divState]="state"
  (@divState.start)="animationStarted($event)"
  (@divState.done)="animationEnded($event)"
></div>
```
