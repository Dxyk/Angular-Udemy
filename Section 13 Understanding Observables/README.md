# Section 13 Understanding Observables

## Observables

### Lesson 169 - Module Introduction

**Observables** can be viewed as various data sources. They are in charge of emitting events or data.

Observables can trigger event or data to be emitted through

- A button click
- An HTTP request
- Programmatically by code

**Observers** are subscribed to observables. They respond to events or data emitted by the observables.

Observers can handle 3 types of events or data. The observers can write logic (callback functions) to define how and what should be executed when they receive these events.

- Data
- Error
- Completion
  - An observable does not have to complete. E.g. a button emits data, but the observer will never know when the button is complete, since it may be clicked multiple times.
  - An HTTP request will have a clear END, which tells observers that the request is complete.

### Lesson 170 - Analyzing Angular Observables

In `user.component.ts`

- `ActivatedRoute.params` is an observable, so it can be subscribed
- When a new piece of data (`Params` - parameter in the url changes) is emitted, the function passed to subscribe to the observable is executed
- In the function, the id is updated according to the id value contained in the `Params`

```ts
import { ... } from '...';

@Component({ ... })
export class UserComponent implements OnInit {
  id: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params.id;
    });
  }
}
```

### Lesson 171. Getting Closer to the Core of Observables

The Observable is a part of the RxJS package. This package needs to be included as one of the dependencies in `package.json`.

One way to get an Observable from RxJS is through the `interval()` method.

- `interval()` takes in an int, which denotes the number of milliseconds
- `interval()` returns an Observable that emits the number of iterations (count) as its data.
- The observable emits the count periodically

Note that for custom observables, we need to unsubscribe from the observable to prevent memory leak.

- `Observable.subscribe()` method returns a `Subscription`, which we can keep track of
- Unsubscribe from the subscription when we don't need to keep track the observable (onDestroy)
- For Observables provided by Angular, there is no need to unsubscribe since Angular does that in the background

In `home.component.ts`

```ts
import { ... } from '...';
import { interval, Subscription } from 'rxjs';

@Component({ ... })
export class HomeComponent implements OnInit, OnDestroy {
  private firstObsSubscription: Subscription;

  ngOnInit() {
    this.firstObsSubscription = interval(1000).subscribe((count) => {
      console.log(count);
    });
  }

  ngOnDestroy() {
    this.firstObsSubscription.unsubscribe();
  }
}
```

### Lesson 172 - Building a Custom Observable

To build a custom `Observable`, use the `Observable()` constructor. Note that `Observable.create()` is deprecated.

- The constructor takes in a function with the `Subscriber` as argument.
- In the function, the Observable can call `Subscriber.next()` or `Subscriber.error()` or `Subscriber.complete()` to execute the logic implemented by the subscriber.

In `home.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class HomeComponent implements OnInit, OnDestroy {
  private firstObsSubscription: Subscription;

  ngOnInit() {
    const customIntervalObservable: Observable<number> = new Observable(
      (subscriber: Subscriber<number>) => {
        let count = 0;
        setInterval(() => {
          subscriber.next(count);
          count++;
        }, 1000);
      }
    );

    this.firstObsSubscription = customIntervalObservable.subscribe((count) => {
      console.log(count);
    });
  }

  ngOnDestroy() {
    this.firstObsSubscription.unsubscribe();
  }
}
```

### Lesson 173 - Errors & Completion

**Error Handling** - Sometimes there might be errors thrown in the `Observable` (e.g. HTTP request failed). To handle these errors, use `Subscriber.error(err)`, and pass in the error handling logic as a function as the second argument of the subscribe method.

**Observer Completion** - Sometimes the `Observable` should indicate that they're complete (e.g. HTTP request completes when they pass back data). To indicate the completion, use `Subscriber.complete()`. The subscriber can choose to implement logic in the complete method and pass it as the third argument of the subscribe method.

Note that if the observable throws an error before it marks it complete, the state of the observable is _cancelled_, instead of _completed_, so the `complete` method will never be called.

In `home.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class HomeComponent implements OnInit, OnDestroy {
  ...

  ngOnInit() {
    const customIntervalObservable: Observable<number> = new Observable(
      (subscriber: Subscriber<number>) => {
        let count = 0;
        setInterval(() => {
          // next
          subscriber.next(count);
          // complete
          if (count === 3) {
            subscriber.complete();
          }
          // error
          if (count > 3) {
            subscriber.error(new Error('Count is greater than 3!'));
          }
          count++;
        }, 1000);
      }
    );

    this.firstObsSubscription = customIntervalObservable.subscribe(
      (count) => {
        console.log(count);
      },
      (error: Error) => {
        console.error(error.message);
      },
      () => {
        console.log('Completed!');
      }
    );
  }
}
```

### Lesson 174 - Observables & You

In reality, building custom observables is not a common practice. Developers usually use observables that come with packages.

## Appendix

### Promise vs Observable

Source: [Medium - Promise vs Observable](https://medium.com/javascript-everyday/javascript-theory-promise-vs-observable-d3087bc1239a)

4 main differences

1. Eager vs Lazy

   1. Promise is eager

      ```ts
      const greetingPoster = new Promise((resolve, reject) => {
        console.log('Inside Promise (proof of being eager)');
        resolve('Welcome! Nice to meet you.');
      });

      console.log('Before calling then on Promise');

      greetingPoster.then((res) =>
        console.log(`Greeting from promise: ${res}`)
      );
      ```

      Output

      1. The code in the Promise constructor is executed
      2. The code (log) in the main body is executed
      3. The code that carries the resolve logic is executed in the `Promise.then()` method

      ```txt
      Inside Promise (proof of being eager)
      Before calling then on Promise
      Greeting from promise: Welcome! Nice to meet you.
      ```

   2. Observable is lazy

      ```ts
      const { Observable } = rxjs;

      const greetingLady$ = new Observable((observer) => {
        console.log('Inside Observable (proof of being lazy)');
        observer.next('Hello! I am glad to get to know you.');
        observer.complete();
      });

      console.log('Before calling subscribe on Observable');

      greetingLady$.subscribe({
        next: console.log,
        complete: () => console.log('End of conversation with pretty lady'),
      });
      ```

      Output

      1. The code (log) in the main body is executed
      2. The log in the observable is within the callback function. This will be executed when the `Observable.subscribe()` method is called
      3. The `next` function (in this case, `console.log`) is called
      4. The complete function is called

      ```txt
      Before calling subscribe on Observable
      Inside Observable (proof of being lazy)
      Hello! I am glad to get to know you.
      End of conversation with pretty lady
      ```

2. Asynchronous vs Synchronous

   1. Promise is **always** asynchronous, even if immediately resolved

      ```ts
      const greetingPoster = new Promise((resolve, reject) => {
        resolve('Welcome! Nice to meet you.');
      });

      console.log('Before calling then on Promise');

      greetingPoster.then((res) =>
        console.log(`Greeting from promise: ${res}`)
      );

      console.log(
        'After calling then on Promise (proof of being always async)'
      );
      ```

      Output

      1. The code (first log) in the main body is executed
      2. The promise is resolved
      3. The code (second log) in the main body is executed
      4. The code in the resolve method is executed async

      ```txt
      Before calling then on Promise
      After calling then on Promise (proof of being always async)
      Greeting from promise: Welcome! Nice to meet you.
      ```

   2. Observable can be synchronous or asynchronous

      - Synchronous version

        ```ts
        const { Observable } = rxjs;

        const greetingLady$ = new Observable((observer) => {
          observer.next('Hello! I am glad to get to know you.');
          observer.complete();
        });

        console.log('Before calling subscribe on Observable');

        greetingLady$.subscribe({
          next: console.log,
          complete: () => console.log('End of conversation with pretty lady'),
        });

        console.log(
          'After calling subscribe on Observable (proof of being able to execute sync)'
        );
        ```

        Output

        1. The first log in the main body is executed
        2. The observer next method is executed
        3. The observer complete method is executed
        4. The second log in the main body is executed

        ```txt
        Before calling subscribe on Observable
        Hello! I am glad to get to know you.
        End of conversation with pretty lady
        After calling subscribe on Observable (proof of being able to execute sync)
        ```

      - Asynchronous version

        ```ts
        const tiredGreetingLady$ = new Observable((observer) => {
          setTimeout(() => {
            observer.next('Hello! I am glad to get to know you.');
            observer.complete();
          }, 2000);
        });

        console.log('Before calling subscribe on Observable');

        tiredGreetingLady$.subscribe({
          next: console.log,
          complete: () =>
            console.log('End of conversation with tired pretty lady'),
        });

        console.log(
          'After calling subscribe on Observable (proof of being able to execute async)'
        );
        ```

        Output

        1. The first log in the main body is executed
        2. The observable is subscribed, and the timeout is set
        3. The second log in the main body is executed
        4. The timeout ends, and the next function is executed
        5. The complete function is executed

        ```txt
        Before calling subscribe on Observable
        After calling subscribe on Observable (proof of being able to execute async)
        Hello! I am glad to get to know you.
        End of conversation with tired pretty lady
        ```

3. Observables can emit multiple values

   1. Promise may provide only a single value

   2. Observable may provide multiple values over time

      ```ts
      const { Observable } = rxjs;

      const notifications$ = new Observable((observer) => {
        const interval = setInterval(() => {
          observer.next('New notification');
        }, 2000);

        return () => clearInterval(interval);
      });

      const subscription = notifications$.subscribe(console.log);

      setTimeout(() => subscription.unsubscribe(), 8000);
      ```

      Output

      1. The Observable provides a new notification every 2 second
      2. The subscription is cancelled after 8 seconds

      ```txt
      New notification
      New notification
      New notification
      New notification
      ```

4. Operators

   1. RxJS has operators that can be applied to Observables

      ```ts
      const { Observable } = rxjs;
      const { map } = rxjs.operators;

      const notifications$ = new Observable((observer) => {
        const interval = setInterval(() => {
          observer.next('New notification');
        }, 2000);

        return () => clearInterval(interval);
      });

      const enhancedNotifications$ = notifications$.pipe(
        map((message) => `${message} ${new Date()}`)
      );

      const subscription = enhancedNotifications$.subscribe(console.log);

      setTimeout(() => subscription.unsubscribe(), 8000);
      ```

      Output

      1. The `map` operator helps append the current date to the notifications
