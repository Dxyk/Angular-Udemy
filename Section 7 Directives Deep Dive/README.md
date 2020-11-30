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

Custom directives are similar to custom components. They live in `<directive-name>/<directive-name>.directive.ts`.

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
