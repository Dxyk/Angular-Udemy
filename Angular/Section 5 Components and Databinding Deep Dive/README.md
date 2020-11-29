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
