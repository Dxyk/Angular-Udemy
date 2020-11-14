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
