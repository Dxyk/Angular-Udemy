# Lessons

## Lesson 2 - Angular

Angular is used to create _reactive_ **Single-Paged-Applications**

Angular uses TypeScript

## Lesson 4 - Angular Versions

There are 2 Angular frameworks commonly known

- Angular 1 / AngularJS
  - The first generation of angular.
  - Many issues.
  - Used less often nowadays.
- Angular 2-10 / Angular 2
  - A complete rewrite of Angular.
  - A new version is released every 6 months
  - Not a lot of difference between all the versions, just adding features etc.

## Lesson 6 - Project Setup and the first app

[Angular CLI](https://github.com/angular/angular-cli) is used to generate boiler codes for Angular apps

[NodeJS](https://nodejs.org/en/) used behind the scenes for Angular

NPM (Node Package Manager) to manage Node packages

1. `npm install -g @angular/cli` - install Angular globally
2. `ng new <app name>` - create a new ng app
3. `ng serve` - start development server that runs the build and serves at `localhost:4200` by default

## Lesson 7 - Editing the first app

Angular CLI automatically rebuilds and serves the server once it detects code changes when `ng serve` is running

**Data Binding** - Bind data in `.component.ts` to `.component.html` to form static html page on serve.

**Directive** - A tool provided by Angular

- Directive `<input type="text" [(ngModel)]="name">` tells Angular to listen to the input and store the input in the variable `name`

**Modules** - Features are divided into separate modules

- To import a module, go to `.module.ts` and add the corresponding module / package in the `import` statement
