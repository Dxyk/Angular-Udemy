# Section 30 Angular Changes & New Features

## Angular Elements

### Lesson 446 - A First Look At Angular Elements

**Angular Elements** is an Angular feature that turns Angular Components into Web Components. **Web Components** are custom HTML components that are a part of the JS DOM API. This is useful for dynamically inserting HTML code holding Angular Component _after_ the Angular App has been compiled and loaded. E.g. Consumers writing plugins that get run in the App iframe can utilize these Web Components.

Create a new Angular project using `ng new <projectName>`.

Create an `AlertComponent` using `ng g c alert`, output a simple text using `@Input() message: string`.

To render the component dynamically, a failed attempt would be the following

In `app.component.ts`

```ts
@Component({ ... })
export class AppComponent {
  content = null;
  constructor() {
    setTimeout(() => {
      this.content = '<app-alert message="This is a normal Angular Component."></app-alert>';
    }, 1000);
  }
}
```

In `app.component.html`

```html
<div [innerHTML]="content"></div>
```

This approach will not work because the hard-coded custom `<app-alert>` element is not recognized by JS DOM API when the Angular app is already compiled.

Angular Elements helps with this issue by encapsulating the custom elements into Web Elements that is recognizable by HTML and JS.

To install Angular Elements, run `ng add @angular/elements` and `npm install @webcomponents/custom-elements` to add the two packages.

In `polyfills.ts`,

- Add import lines to import necessary `@webcomponents` polyfills

```js
import '@webcomponents/custom-elements/custom-elements.min';
import '@webcomponents/custom-elements/src/native-shim';
```

In `app.component.ts`

- Use `createCustomElement` to create a custom Web Element for the component
  - Use the Angular Injector to inject the custom component
- Use `customElements.define()` to define the selector for the custom element
- Render the element dynamically
  - Angular does not render HTML by default to avoid XSS attacks
  - Use `DomSanitizer.bypassSecurityTrustHtml` to bypass security checks for the injected HTML code

```ts
@Component({ ... })
export class AppComponent {
  content = null;

  constructor(injector: Injector, domSanitizer: DomSanitizer) {
    const alertElement = createCustomElement(AlertComponent, {
      injector,
    });

    customElements.define('my-alert', alertElement);

    setTimeout(() => {
      this.content =
        '<my-alert message="This is a normal Angular Component."></my-alert>';
    }, 1000);
  }
}
```

### Lesson 447 - What's New & How to Update

When new Angular versions are released, read the official documents to learn more about the new version.

To update existing projects, `ng update` usually works.
