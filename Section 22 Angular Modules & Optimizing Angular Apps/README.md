# Section 22 Angular Modules & Optimizing Angular Apps

## Angular Modules

### Lesson 319 - Module Introduction

### Lesson 320 - What are Modules?

Angular **Modules** bundle Angular building blocks (e.g. Components, Directives, Services, Pipes, etc) together. Each Angular app must contain at least 1 module: `AppModule`.

A Module contains declarations of these building blocks. Angular analyzes these declarations in the `@NgModule` decorator and gains information about the application and features stored in the module.

There are also Angular's built in feature modules such as `FormsModule`, so consumers can also include these features in their `AppModule` and use them out of the box.
