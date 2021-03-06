# Section 7 Directives Deep Dive

## Directives

### Lesson 90 - Module Introduction

Directives

- Attributes Directives
  - Similar to normal HTML attributes
  - Only affect / change the element they are added to
  - E.g. `ngClass`, `ngStyle`
- Structural Directives
  - Similar to normal HTML attributes but with a leading `*`
  - Affect area of DOM around the element (add and delete elements)
  - E.g. `*ngIf`, `*ngFor`

### Lesson 91 - ngFor and ngIf Recap

Within an element in the template, there can only be one structural directive. I.e. Using both `*ngIf` and `*ngFor` in an element will throw an error.

### Lesson 92 - ngClass and ngStyle Recap

There can be multiple attribute directives on a single element. Note that attribute directives need to be enclosed by squared brackets `[]` because we are binding properties to the `ngClass` directive.

### Lesson 93 - Creating a Basic Attribute Directive

Custom directives are similar to custom components. They live in `<directive-folder (shared/directives)>/<directive-name>.directive.ts`.

In `basic-highlight/basic-highlight.directive.ts`

- To make a class a directive, use the `@Directive` decorator.

  - Same as components, must have a unique selector
  - To let Angular know a directive is an attribute directive, add squared brackets around the selector name.
  - The directive name is the value within the squared brackets of the selector (`appBasicHighlight` in this case)
  - The squared brackets is a selector style that informs Angular to select the selector as an attribute on an element

- Angular provides injection through constructor so the directive has access to the component
  - Note the `private` in the constructor signature is a TS shortcut that makes `elementRef` a private property of this class that is initialized as the injected `ElementRef` object

```ts
import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appBasicHighlight]',
})
export class BasicHighlightDirective implements OnInit {
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.elementRef.nativeElement.style.backgroundColor = 'green';
  }
}
```

In `app.module.ts`, add the newly created directive to `declarations`

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BasicHighlightDirective } from './basic-highlight/basic-highlight.directive';

@NgModule({
  declarations: [AppComponent, BasicHighlightDirective],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

In `app.component.html`, to use this new basic directive

- Don't use squared brackets
- The directive name is the value within the squared brackets of the selector
- The squared brackets in the selector is a selector style that informs Angular to select the selector as an attribute on an element

```html
<p appBasicHighlight>Style me with basic highlight!</p>
```

### Lesson 94 - Using the Renderer to build a Better Attribute Directive

To generate a directive using the Angular CLI,

```sh
# these two are equivalent
ng generate directive <directive-name>
ng g d <directive-name>
```

Accessing elements in the DOM in TS is not a good practice. Angular is not limited to running in the browser. E.g. it also work with service workers, where Angular won't have access to the DOM. In this case, accessing DOM elements might throw errors.

Angular provides a `Renderer2` object that helps manipulating the DOM within TS code.

In `better-highlight.directive.ts`

```ts
import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appBetterHighlight]',
})
export class BetterHighlightDirective implements OnInit {
  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.setStyle(this.elRef.nativeElement, 'backgroundColor', 'blue');
  }
}
```

In `app.component.html`

```html
<p appBetterHighlight>Style me with a better highlight!</p>
```

### Lesson 95 - More about the Renderer

The `Renderer2` object has more methods to perform DOM manipulation. See documentations for details

### Lesson 96 - Using HostListener to Listen to Host Events

To listen to DOM events occurring on the element that the directive sits on, use `@HostListener`.

In `better-highlight.directives.ts`

- `@HostListener(eventName)` takes in a `eventName` that is the name of a DOM supported event.
- `@HostListener` decorates a event listener method that is triggered once the event is fired

```ts
import {...} from '...';

@Directive({
  selector: '[appBetterHighlight]',
})
export class BetterHighlightDirective implements OnInit {
  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {}

  @HostListener('mouseenter')
  onMouseOver(eventData: Event) {
    this.renderer.setStyle(this.elRef.nativeElement, 'backgroundColor', 'blue');
  }

  @HostListener('mouseleave')
  onMouseLeave(eventData: Event) {
    this.renderer.setStyle(
      this.elRef.nativeElement,
      'backgroundColor',
      'transparent'
    );
  }
}
```

### Lesson 97 - Using HostBinding to Bind to Host Properties

An alternative to using the `Renderer` to modify the DOM is to use `@HostBinding`

In `better-highlight.directive.ts`

- `@HostBinding(elementProperty)` takes in a string that denotes the host element property to bind the directive property to.
- The element property is the same as when directly accessing `ElementRef.nativeElement.<property1.property2>`
- After the element property is bind to decorator property, changing the decorator property will change the element property.

```ts
import {...} from '...';

@Directive({
  selector: '[appBetterHighlight]',
})
export class BetterHighlightDirective implements OnInit {
  @HostBinding('style.backgroundColor')
  backgroundColor = 'transparent';

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
  }

  @HostListener('mouseenter')
  onMouseOver(eventData: Event) {
    this.backgroundColor = 'blue';
  }

  @HostListener('mouseleave')
  onMouseLeave(eventData: Event) {
    this.backgroundColor = 'transparent';
  }
}
```

### Lesson 98 - Binding to Directive Properties

To dynamically set directive values, use `@Input()` on custom properties in the directive.

In HTML

- These `@Input` properties are set on the same level as the directive.
- Angular figures out whether a property is custom or native HTML.

In `better-highlight.directive.ts`

```ts
import {...} from '...';

@Directive({
  selector: '[appBetterHighlight]',
})
export class BetterHighlightDirective implements OnInit {
  @Input()
  defaultColor = 'transparent';

  @Input()
  highlightColor = 'blue';

  @HostBinding('style.backgroundColor')
  backgroundColor: string;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.backgroundColor = this.defaultColor;
  }

  @HostListener('mouseenter')
  onMouseOver(eventData: Event) {
    this.backgroundColor = this.highlightColor;
  }

  @HostListener('mouseleave')
  onMouseLeave(eventData: Event) {
    this.backgroundColor = this.defaultColor;
  }
}
```

In `app.component.html`

```html
<p appBetterHighlight [defaultColor]="'yellow'" [highlightColor]="'red'">
  Style me with a better highlight!
</p>
```

Special case: When the directive has a main property to be set as `@Input`, it is possible to use the input alias to set the property's alias to the directive name

In `better-highlight.directive.ts`

```ts
import {...} from '...';

@Directive({
  selector: '[appBetterHighlight]',
})
export class BetterHighlightDirective implements OnInit {
  @Input()
  defaultColor = 'transparent';

  @Input('appBetterHighlight')
  highlightColor = 'blue';
  ...
}
```

In `app.component.html`

```html
<p [appBetterHighlight]="'red'" [defaultColor]="'yellow'">
  Style me with a better highlight!
</p>
```

### Lesson 99 - What Happens behind the Scenes on Structural Directives

Structural directives must have a `*` before them because this informs Angular that these are structural directives.

Behind the scenes, all usage of structural directives are encapsulated by a `ng-template` element. `ng-template` is not actually rendered, but provides properties that determines whether its content should be rendered.

```html
<div *ngIf="true">
  <p>Hello World</p>
</div>
```

is equivalent to

```html
<ng-template [ngIf]="true">
  <div>
    <p>Hello World</p>
  </div>
</ng-template>
```

### Lesson 100 - Building a Structural Directive

Creating a structural directive is similar to creating a property directive. The difference is that we need to

- Inject `ViewContainer` to access the the view
- Inject `TemplateRef<any>` to access the `ng-template` and the content in it.

In `unless.directive.ts`

- `set unless(condition: boolean) {}` is a setter method that gets invoked whenever the property (`unless` in this case) gets changed from outside the directive.

```ts
import {...} from '...';

@Directive({
  selector: '[appUnless]',
})
export class UnlessDirective {
  @Input('appUnless')
  set unless(condition: boolean) {
    if (!condition) {
      this.vcRef.createEmbeddedView(this.templateRef);
    } else {
      this.vcRef.clear();
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private vcRef: ViewContainerRef
  ) {}
}
```

In `app.component.html`

```html
<div *appUnless="false">
  <p>Hello World</p>
</div>
```

### Lesson 101 - Understanding ngSwitch

`ngSwitch` is useful when dealing with multiple `*ngIf`s.

In `app.component.html`

- `ngSwitch` is a property directive
- `ngSwitchCase` and `ngSwitchDefault` are structural directives

```html
<div [ngSwitch]="value">
  <p *ngSwitchCase="5">Value is 5</p>
  <p *ngSwitchCase="10">Value is 10</p>
  <p *ngSwitchCase="100">Value is 100</p>
  <p *ngSwitchDefault>Value is Default</p>
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
  value = 10;
}
```
