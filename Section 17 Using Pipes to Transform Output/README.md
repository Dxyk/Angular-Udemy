# Section 17 Using Pipes to Transform Output

## Pipes

### Lesson 240 - Introduction & Why Pipes are Useful

**Pipes** are a feature built into Angular2 that allows output transformation in the template. There are synchronous and asynchronous pipes that can handle different types of outputs.

For example,

In TS

```ts
userName = 'Name';
```

In HTML

```html
<p>{{ userName | uppercase }}</p>
```

This will render string `"NAME"`, while keeping the `userName` variable in TS unchanged.

### Lesson 241 - Using Pipes

Using pipes in HTML follows the format of `originalOutput | pipeMethod`.

For example, we want to transform some outputs at render time

In `app.component.html`

- Transform the `instanceType` to upper case using `uppercase`
- Transform the `started` date to readable date format using `date`
- Note that the `uppercase` and `date` pipes are built-in pipes in Angular

```html
{{ server.instanceType | uppercase }} | {{ server.started | date }}
```

### Lesson 242 - Parametrizing Pipes

**Parametrizing pipes** - Some pipes have options / parameters so users can configure them. These parameters determine how the pipes will function.

To parametrize a pipe, use the format of `originalOutput | pipeMethod: parameterInput1: parameterInput2`

In `app.component.html`

```html
{{ server.started | date: 'fullDate' }}
```
