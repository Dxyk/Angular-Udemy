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
