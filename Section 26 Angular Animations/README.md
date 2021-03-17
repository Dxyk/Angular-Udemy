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
