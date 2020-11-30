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
