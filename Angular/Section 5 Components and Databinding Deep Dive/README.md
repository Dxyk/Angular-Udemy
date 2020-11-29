# Section 5 Components & Databinding Deep Dive

## Components and Databinding

### Lesson 63 - Module Introduction

### Lesson 64 - Splitting Apps into Components

Split apps into smaller components for clarity and reusability.

Problem: How do we let different components communicate with each other?

### Lesson 65 - Property and Event Binding Overview

To enable communication between components, we need the following two

- Property Binding - pass data
- Event Binding - listen to event input

Property and Event Binding apply to

- HTML native elements
- Properties and events in Ng Directives (e.g. `ngStyle` and `ngClass`.)
- Custom properties and events in Components

### Lesson 66 - Binding to Custom Properties

By default, all properties of a component are only accessible from within the component. To expose a property, use decorator `@Input()`

In `app.component.html`

```html
<app-server-element
  *ngFor="let serverElement of serverElements"
  [element]="serverElement"
>
</app-server-element>
```

In `app.component.ts`

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  serverElements = [{ type: 'server', name: 'name', content: 'content' }];
}
```

In `server-element.component.html`

```html
<div class="panel-heading">{{ element.name }}</div>
<div class="panel-body">
  <p>
    <strong *ngIf="element.type === 'server'" style="color: red"
      >{{ element.content }}</strong
    >
    <em *ngIf="element.type === 'blueprint'">{{ element.content }}</em>
  </p>
</div>
```

In `server-element.component.ts`, notice the `@Input` decorator for the property `element`. This exposes the property so that it can be read / assigned from outside the component.

```ts
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-server-element',
  templateUrl: './server-element.component.html',
  styleUrls: ['./server-element.component.css'],
})
export class ServerElementComponent implements OnInit {
  @Input()
  element: { type: string; name: string; content: string };

  constructor() {}

  ngOnInit(): void {}
}
```

### Lesson 67 - Assigning an Alias to Custom Properties

To create an alias of a property means from outside the component, the property will be referred as the alias.

This is achieved through `@Input('aliasName')`

In `app.component.html`

```html
<app-server-element
  *ngFor="let serverElement of serverElements"
  [serverElement]="serverElement"
>
</app-server-element>
```

In `server-element.component.ts`

```ts
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-server-element',
  templateUrl: './server-element.component.html',
  styleUrls: ['./server-element.component.css'],
})
export class ServerElementComponent implements OnInit {
  @Input('serverElement')
  element: { type: string; name: string; content: string };

  constructor() {}

  ngOnInit(): void {}
}
```

### Lesson 68 - Binding to Custom Events

A component may wish to inform a change (emit an event) to the parent component so the parent component can respond accordingly. To achieve this, use event binding.

In `app.component.html`

```html
<div class="container">
  <app-cockpit
    (serverCreated)="onServerAdded($event)"
    (blueprintCreated)="onBlueprintAdded($event)"
  ></app-cockpit>
</div>
```

In `app.component.ts`

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  serverElements: {
    type: string;
    name: string;
    content: string;
  }[] = [];

  onServerAdded(serverData: { serverName: string; serverContent: string }) {
    this.serverElements.push({
      type: 'server',
      name: serverData.serverName,
      content: serverData.serverContent,
    });
  }

  onBlueprintAdded(blueprintData: {
    serverName: string;
    serverContent: string;
  }) {
    this.serverElements.push({
      type: 'blueprint',
      name: blueprintData.serverName,
      content: blueprintData.serverContent,
    });
  }
}
```

No change in `cockpit.component.html`

In `cockpit.component.html`

```ts
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.css'],
})
export class CockpitComponent implements OnInit {
  @Output()
  serverCreated = new EventEmitter<{
    serverName: string;
    serverContent: string;
  }>();
  @Output()
  blueprintCreated = new EventEmitter<{
    serverName: string;
    serverContent: string;
  }>();
  newServerName = '';
  newServerContent = '';

  constructor() {}

  ngOnInit(): void {}

  onAddServer() {
    this.serverCreated.emit({
      serverName: this.newServerName,
      serverContent: this.newServerContent,
    });
  }

  onAddBlueprint() {
    this.blueprintCreated.emit({
      serverName: this.newServerName,
      serverContent: this.newServerContent,
    });
  }
}
```

### Lesson 69 - Assigning an Alias to Custom Events

Similar to `@Input(alias: string)`, `@Output()` also allows the custom events to have different alias referenced in the HTML component.

In `cockpit.component.ts`

```ts
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.css'],
})
export class CockpitComponent implements OnInit {
  @Output('serverCreatedEvent')
  serverCreated = new EventEmitter<{
    serverName: string;
    serverContent: string;
  }>();
  ...
}
```

### Lesson 70 - Custom Property and Event Binding Summary

`@Input` allows component properties to be bind from outside, the parent component.

`@Output` allows parent components to listen to events emitted from the component.

### Lesson 71 - Understanding View Encapsulation

Angular enforces the **view** of the component to be encapsulated within the component. E.g. style definitions in the parent component does not apply to the child components. To achieve this, Angular adds generated classes to the HTML elements to distinguish elements in each component.

### Lesson 72 - More on View Encapsulation

Angular View Encapsulation can be configured. The `@Component` decorator contains a `encapsulation` attribute. The default value is `Emulated`. By setting it to `None`, the View Encapsulation for this component is turned off, and the styles defined in the component gets applied globally.

In `server-element.component.ts`,

```ts
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-server-element',
  templateUrl: './server-element.component.html',
  styleUrls: ['./server-element.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ServerElementComponent implements OnInit {
  ...
}
```

### Lesson 73 - Using Local References in Templates

An alternative to obtain data from the HTML element using two way binding (`([ngModel])="field"`) is to use **local reference** `<element #referenceName>`. The reference only works locally in the template and not the component.

In `cockpit.component.html`

```html
<div class="row">
  <div class="col-xs-12">
    <p>Add new Servers or blueprints!</p>
    <label>Server Name</label>
    <input type="text" class="form-control" #serverNameInput />
    <label>Server Content</label>
    <input type="text" class="form-control" [(ngModel)]="newServerContent" />
    <br />
    <button class="btn btn-primary" (click)="onAddServer(serverNameInput)">
      Add Server
    </button>
    <button class="btn btn-primary" (click)="onAddBlueprint(serverNameInput)">
      Add Server Blueprint
    </button>
  </div>
</div>
```

In `cockpit.component.ts`

```ts
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.css'],
})
export class CockpitComponent implements OnInit {
  ...

  onAddServer(serverNameInput: HTMLInputElement) {
    this.serverCreated.emit({
      serverName: serverNameInput.value,
      serverContent: this.newServerContent,
    });
  }

  onAddBlueprint(serverNameInput: HTMLInputElement) {
    this.blueprintCreated.emit({
      serverName: serverNameInput.value,
      serverContent: this.newServerContent,
    });
  }
}
```

### Lesson 74 - @ViewChild() in Angular 8+

### Lesson 75 - Getting Access to the Template & DOM with @ViewChild

Local reference can be used as inputs in HTML template (e.g. `<button class="btn btn-primary" (click)="onAddBlueprint(serverNameInput)">`).

`@ViewChild(selector: string, {static: bool})` provides an alternative that allows accessing local references or HTML elements within the TS code before invoking TS methods.

- The selector argument is either an element (less commonly used) or a string that is the name of the local reference in the template.
- In the second argument contains a `static` attribute.
  - Set to `true` if access the element in `ngOnInit`
  - Set to `false` (by default) if access the element in the component but not in `ngOnInit`

Note:

Do not attempt to access / modify DOM in TS by `this.localReference.nativeElement.value = ""`. Angular offers directives to manipulate the DOM, and property binding and string interpolation to access DOM.

In `cockpit.component.html`

```html
<div class="row">
  <div class="col-xs-12">
    <p>Add new Servers or blueprints!</p>
    <label>Server Name</label>
    <input type="text" class="form-control" #serverNameInput />
    <label>Server Content</label>
    <input type="text" class="form-control" #serverContentInput />
    <br />
    <button class="btn btn-primary" (click)="onAddServer(serverNameInput)">
      Add Server
    </button>
    <button class="btn btn-primary" (click)="onAddBlueprint(serverNameInput)">
      Add Server Blueprint
    </button>
  </div>
</div>
```

In `cockpit.component.ts`

```ts
@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.css'],
})
export class CockpitComponent implements OnInit {
  @Output('serverCreated')
  serverCreated = new EventEmitter<{
    serverName: string;
    serverContent: string;
  }>();
  @Output()
  blueprintCreated = new EventEmitter<{
    serverName: string;
    serverContent: string;
  }>();
  @ViewChild('serverContentInput', { static: true })
  serverContentInput: ElementRef<HTMLInputElement>;

  constructor() {}

  ngOnInit(): void {}

  onAddServer(serverNameInput: HTMLInputElement) {
    this.serverCreated.emit({
      serverName: serverNameInput.value,
      serverContent: this.serverContentInput.nativeElement.value,
    });
  }

  onAddBlueprint(serverNameInput: HTMLInputElement) {
    this.blueprintCreated.emit({
      serverName: serverNameInput.value,
      serverContent: this.serverContentInput.nativeElement.value,
    });
  }
}
```

### Lesson 76 - Projecting Content into Components with ng-content

Sometimes property binding may not be the ideal way to pass complex content (e.g. HTML code instead of string) between components.

By default, anything added within custom directives opening and closing tags are ignored by Angular (e.g. `<customComponent></customComponent>`). To avoid this, Add `<ng-content></ng-content>` in the child component (`customComponent` in this case) where external content can be projected.

In `server-element.component.html`

```html
<div class="panel panel-default">
  <div class="panel-heading">{{ element.name }}</div>
  <div class="panel-body">
    <ng-content></ng-content>
  </div>
</div>
```

In `app.component.html`, notice the variable names of the content has to match with the variables defined in `ngFor`.

```html
<div class="container">
  <app-server-element
    *ngFor="let serverElement of serverElements"
    [serverElement]="serverElement"
  >
    <p>
      <strong *ngIf="serverElement.type === 'server'" style="color: red"
        >{{ serverElement.content }}</strong
      >
      <em *ngIf="serverElement.type === 'blueprint'"
        >{{ serverElement.content }}</em
      >
    </p>
  </app-server-element>
</div>
```

### Lesson 77 - Understanding the Component Lifecycle

Angular supports multiple lifecycle hooks such as `ngOnInit`.

On creating a new component, Angular goes through lifecycle phases, and within these phases, we can execute code by adding them into these lifecycle hooks

1. `ngOnChanges`
   1. Called when the component is first initialized
   2. Called when bound input property changes. (properties decorated with `@Input()`)
2. `ngOnInit`
   1. Called once the component is initialized (run after the constructor)
   2. At this phase, the component has not yet been added to the DOM, but the object has been created
3. `ngDoCheck`
   1. Called on every check that Angular makes.
   2. Angular makes these checks to detect property value changes and reflect these changes in the template.
   3. Note that this is not only called when there are changes made. It is called whenever Angular performs the check operation (no matter if the properties have changed).
   4. Examples include clicking a button, focusing / defocusing on a text field, keyboard events, etc
4. `ngAfterContentInit`
   1. Called after content (ng-content) has been projected into the view
   2. Called when `ngDoCheck` is called in the parent component
5. `ngAfterViewInit`
   1. Called after the view of the own component has been initialized (view rendered in DOM)
6. `ngOnDestroy`
   1. Called when the component is destroyed (e.g. `ngIf` returns false and no longer display the component)

### Lesson 78 - Seeing Lifecycle Hooks in Action

See `server-element.component.ts` and check console logs to see lifecycle happening in real time.

Note only `ngOnChanges(changes: SimpleChange): void` takes in a changes event

### Lesson 79 - Lifecycle Hooks and Template Access

From `server-element.component.ts`, using `@ViewChild`, we see that the DOM element value is not set in `ngOnInit`. It is only set after `ngAfterViewInit`.

### Lesson 80 - @ContentChild() in Angular 8+

### Lesson 81 - Getting Access to ng-content with @ContentChild

To access element passed in by `ng-content`, label the content with local reference and use `@ContentChild` in the component to access the passed in element. The content will not be viewable at `ngOnInit`, but will be viewable since `ngAfterContentInit`.

See `server-element.component.ts`

### Lesson 82 - Wrap Up

## Assignment 4 - Practicing Property & Event Binding and View Encapsulation

### Lesson 83 - Assignment Solution

See `./assignment-4/`
