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
