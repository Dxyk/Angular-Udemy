# Section 22 Angular Modules & Optimizing Angular Apps

## Angular Modules

### Lesson 319 - Module Introduction

### Lesson 320 - What are Modules?

Angular **Modules** bundle Angular building blocks (e.g. Components, Directives, Services, Pipes, etc) together. Each Angular app must contain at least 1 module: `AppModule`.

A Module contains declarations of these building blocks. Angular analyzes these declarations in the `@NgModule` decorator and gains information about the application and features stored in the module.

There are also Angular's built in feature modules such as `FormsModule`, so consumers can also include these features in their `AppModule` and use them out of the box.

### Lesson 321 - Analyzing the AppModule

In the [course-project](../course-project), there are 2 modules: `AppModule` and `AppRoutingModule`.

In `@NgModule`, there are a few common properties

- `declarations` is an array of all the components, directives and custom pipes that are used in HTML templates or routes.
- `imports` is an array of imported modules. These could be Angular built-in modules or custom modules.
- `providers` is an array of all the services the current module provides. It is not always the case that services can only be used within the module. This will be explained in a later lesson.
  - All services that is injectable need to either be provided in `@NgModule({ providers: [] })` array, or `@Injectable({ providedIn: 'root' })`.
- `bootstrap` is an array that defines the Components available right away in the `index.html` when the application starts up.
- `entryComponents` are components created programmatically.
- `exports` is an array of features (Modules or Components) that an external module should have access to.
  - In Angular, all Modules work independently from each other.
