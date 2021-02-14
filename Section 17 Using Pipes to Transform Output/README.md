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

### Lesson 243 - Where to learn more about Pipes

Use [Angular.io's docs](https://angular.io/api?query=pipe) to search for available built-in Angular pipes

### Lesson 244 - Chaining Multiple Pipes

It is possible to chain multiple pipes. The format is similar to applying pipes: `originalOutput | pipeMethod1 | pipeMethod2`

Note the order of pipe chaining matters. Generally, the pipes are applied from left to right. I.e. In the above example, `pipeMethod1` will be applied to `originalOutput` first, and then that output is transformed by `pipeMethod2`

In `app.component.html`

- First format the date
- Then transform the formatted date to uppercase
- Note if the order is reversed, the uppercase pipe will throw an error because it will not know how to handle `Date` objects

```html
{{ server.started | date: 'fullDate' | uppercase }}
```

### Lesson 245 - Creating a Custom Pipe

To create a pipe, use the command

```sh
ng generate pipe <pipe-name>
```

This command does the following

- It creates a `pipe-name.pipe.ts` file
  - The pipe class will implement the `PipeTransform` interface, which forces the implementation of `transform(value: any, ...args: any[]): any`
  - The class will be annotated with `@Pipe()` decorator, which takes in an object as parameter
    - The `name` field specifies the name of the pipe when using it in the template
- It adds the `PipeName` pipe to the `declarations` in `AppModule`
- It creates a `pipeName.pipe.spec.ts` file for unit testing

In `shorten.pipe.ts`

```ts
import { ... } from '...';

@Pipe({
  name: 'shorten',
})
export class ShortenPipe implements PipeTransform {
  transform(value: string): string {
    if (value.length > 10) {
      return value.substr(0, 10) + ' ...';
    }
    return value;
  }
}
```

In `app.component.html`

```html
<strong>{{ server.name | shorten }}</strong>
```

### Lesson 246 - Parametrizing a Custom Pipe

To parametrize a custom pipe, add an argument in the `transform` method. To use it in the HTML template, add a column and set the parameter.

There is no limit to how many parameters / arguments there can be for a pipe.

In `shorten.pipe.ts`

```ts
import { ... } from '...';

@Pipe({ name: 'shorten' })
export class ShortenPipe implements PipeTransform {
  transform(value: string, limit: number): string {
    if (value.length > limit) {
      return value.substr(0, limit) + ' ...';
    }
    return value;
  }
}
```

In `app.component.html`

```html
<strong>{{ server.name | shorten: 15 }}</strong>
```

### Lesson 247 - Example: Creating a Filter Pipe

Goal: add a filter section so the user can filter the servers base on the input status.

Create a pipe named filter using `ng g p filter`

In `filter.pipe.ts`

```ts
import { ... } from '...';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(value: any, filterString: string, propertyName: string): any {
    if (value.length === 0 || filterString.trim() === '') {
      return value;
    } else {
      const resultArray: any[] = [];
      for (const item of value) {
        if (item[propertyName] === filterString) {
          resultArray.push(item);
        }
      }
      return resultArray;
    }
  }
}
```

In `app.component.html`

- Note the pipe was added to the `*ngFor` directive. This is ok because `*ngFor` also produces output in the template, and pipes can transform all kinds of outputs in the template

```html
<input type="text" [(ngModel)]="filteredStatus" />
<ul class="list-group">
  <li
    class="list-group-item"
    *ngFor="let server of servers | filter: filteredStatus: 'status'"
    [ngClass]="getStatusClasses(server)"
  ></li>
</ul>
```

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent {
  ...
  filteredStatus = '';
  ...
}
```

### Lesson 248 - Pure and Impure Pipes (or: How to "fix" the Filter Pipe)

In `app.component.html`

```html
<button class="btn btn-primary" (click)="onAddServer()">Add Server</button>
```

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent {
  ...
  onAddServer(): void {
    this.servers.push({
      instanceType: 'small',
      name: 'New Server',
      status: 'stable',
      started: new Date(2021, 2, 14),
    });
  }
}
```

A undesired behavior in the current implementations:

If the filter pipe's value is non-empty, adding another server does not show up in the list even if it should.

This is not a bug. Angular does not rerun the pipe whenever the data list changes, so that it does not increase the performance cost. The pipe will only be triggered when the parameter is changed. Updating arrays or objects won't trigger a recalculation.

There is a way to work around this, but could potentially bring performance issues. By setting `pure: false` in the `@Pipe` decorator, the pipe recalculates whenever any data is changed on the page (not only the data being transformed by the pipe).

In `filter.pipe.ts`

```ts
import { ... } from '...';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {
  ...
}
```

### Lesson 249 - Understanding the "async" Pipe

There is a special `async` pipe that can help handle async data.

Given a data that is async, the `async` pipe will not render the data until the `Promise` / `Observable` resolves.

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent {
  appStatus = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('stable');
    }, 2000);
  });
  ...
}
```

In `app.component.html`

- Note string-interpolating `appStatus` without the `async` pipe will only return `[Object Promise]`, and will not resolve after the Promise is resolved.
  - This is a good thing because Angular doesn't have to constantly monitor it, so it saves performance.

```html
<h2>App Status: {{ this.appStatus | async }}</h2>
```

## Assignment 8

See [assignment-8](./assignment-8)
