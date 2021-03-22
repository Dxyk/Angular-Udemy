# Section 28 A Basic Introduction to Unit Testing in Angular Apps

## Unit Testing

### Lesson 420 - About this Section

This section only provides an introduction to Unit Testing an Angular 2+ App.

For detailed guide about Unit Testing an Angular 2+ app or detailed introduction to Unit Testing in general, see "Further Resources" in the last lesson in this section.

### Lesson 421 - Introduction

### Lesson 422 - Why Unit Tests

Unit tests provide guarantee that when the code is changed, existing features still work properly. They provide guards against breaking changes, helps developers analyze code behavior (both expected and unexpected ones) and reveals design mistakes.

### Lesson 423 - Analyzing the Testing Setup (as created by the CLI)

Create an empty project using `ng new <projectName>`.

In the Angular app, the `*.spec.ts` file represents the test files. Unit tests are essentially scripts running against the application. In order to simulate the same behavior, it is necessary to bootstrap the application and set up the necessary modules. After that, developers can execute tasks to simulate user behaviors.

In `app.component.spec.ts`

- `describe` describes a suite of tests
- `beforeEach` gets executed before every single test
  - `TestBed` is the main Angular Testing Utility object
    - `TestBed.configureTestingModule()` allows configurations on the current testing environment
- `it` declares the unit test case
  - `fixture` is a commonly used variable that represents the target component / building block that is being tested
  - `detectChange` triggers change detection so that the applied changes can be loaded
  - `TestBed.createComponent()` creates an instance of the component
- Different testing frameworks have different syntax for verifying expected and actual outputs
  - By default, Angular CLI uses `Karma`, which has syntax of `expect(actual).toEqual(expected)`

```ts
describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'section28-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('section28-app');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain(
      'section28-app app is running!'
    );
  });
});
```

### Lesson 424 - Running Tests (with the CLI)

To run the tests using the CLI, run `ng test`. The test result will be shown in the log - either `Executed x of x SUCCESS` or `Executed x of x (y FAILED)`. The logs also provide info on which tests failed and their stacktrace.

### Lesson 425 - Adding a Component and some fitting Tests

Create a `user` component using `ng g c user`, and add some basic logic

In `user.component.html`

```html
<div *ngIf="isLoggedIn">
  <h1>User logged in</h1>
  <p>User is: {{ user.name }}</p>
</div>
<div *ngIf="!isLoggedIn">
  <h1>User not logged in</h1>
  <p>Please login first</p>
</div>
```

In `user.component.ts`

```ts
@Component({ ... })
export class UserComponent implements OnInit {
  user: { name: string };
  isLoggedIn = false;
}
```

In `user.component.spec.ts`, write tests for the newly created `UserComponent`

- Use `TestBed.configureTestingModule` to declare the `UserComponent`
  - After all configurations are done, use `compileComponent` to compile everything

```ts
describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Lesson 426 - Testing Dependencies: Components and Services

Create a `UserService` using `ng g s user/user`

In `user.service.ts`

```ts
export class UserService {
  user = { name: 'Name' };
}
```

In `user.component.ts`

```ts
@Component({
  ...,
  providers: [UserService],
})
export class UserComponent implements OnInit {
  ...;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.user;
  }
}
```

In `user.component.spec.ts`

- Use `fixture.debugElement.injector.get(UserService)` to get the injected classes
- Make sure to detect changes before assertions if the component is supposed to be updated

```ts
describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  ...

  it('should use user name from the service', () => {
    const userService = fixture.debugElement.injector.get(UserService);
    expect(userService.user.name).toEqual(component.user.name);
  });

  it('should display user name if user is logged in', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain(
      component.user.name
    );
  });

  it('should not display user name if user is logged in', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).not.toContain(
      component.user.name
    );
  });
});
```

### Lesson 427 - Simulating Async Tasks

Create a shared `DataService` using `ng g s shared/data`

In `data.service.ts`

```ts
export class DataService {
  getDetails(): Promise<string> {
    const resultPromise = new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve('Data');
      }, 1500);
    });
    return resultPromise;
  }
}
```

In `user.component.ts`

```ts
@Component({
  ...,
  providers: [UserService, DataService],
})
export class UserComponent implements OnInit {
  data: string;

  constructor(
    private userService: UserService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.user;
    this.dataService.getDetails().then((data: string) => {
      this.data = data;
    });
  }
}
```

In `user.component.spec.ts`

- To test asynchronous methods
  - The test should simulate or mock the returned data instead of actually making the requests
    - Use `spyOn` to spy on the building block making the async method call, and use `.and.return(data)` to mock the returned data
  - The `it(description, method)`'s method should be declared as `async`, so Angular is aware that the test contains async calls
  - When the async call is supposed to end, use `fixture.whenStable().then()` to wrap the rest of the logic

```ts
describe('UserComponent', () => {
  ...
  it('should not fetch data successfully if not called asynchronously', () => {
    const dataService = fixture.debugElement.injector.get(DataService);
    const spy = spyOn(dataService, 'getDetails').and.returnValue(
      Promise.resolve('Data')
    );
    fixture.detectChanges();
    expect(component.data).toBe(undefined);
  });

  it('should not fetch data successfully if not called asynchronously', async () => {
    const dataService = fixture.debugElement.injector.get(DataService);
    const spy = spyOn(dataService, 'getDetails').and.returnValue(
      Promise.resolve('Data')
    );
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.data).toBe(undefined);
    });
  });
});
```

### Lesson 428 - Using "fakeAsync" and "tick"

In `user.component.spec.ts`

- An alternative of `async` is the `fakeAsync()` method
  - Wrap the arrow function in `it` with the `fakeAsync` method
  - Instead of using `fixture.whenStable().then()`, use `tick()` to finish all asynchronous tasks immediately
- The difference is that
  - With `async`, the test carries out the same workflow as the user would experience
  - With `fakeAsync`, the test simply skips the asynchronous task

```ts
describe('UserComponent', () => {
  ...
  it('should not fetch data successfully if not called asynchronously', fakeAsync(() => {
    const dataService = fixture.debugElement.injector.get(DataService);
    const spy = spyOn(dataService, 'getDetails').and.returnValue(
      Promise.resolve('Data')
    );
    fixture.detectChanges();
    tick();
    expect(component.data).toBe(undefined);
  }));
});
```
