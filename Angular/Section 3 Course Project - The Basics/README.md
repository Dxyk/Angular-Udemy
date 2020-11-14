# Section 3 Course Project - The Basics

## Course Project

### Lesson 43 - Project Introduction

Goal: build a shopping list and recipe project.

### Lesson 44 - Planning the Application

Goal: decide what components to use base on the features.

### Lesson 45 - Installing Bootstrap Correctly

In the terminal

```sh
npm install --save bootstrap@3
```

make sure `"node_modules/bootstrap/dist/css/bootstrap.min.css"` is in the `styles` list in `angular.json`

### Lesson 46 - Setting up the application

In terminal

```sh
npm install
ng serve
```

### Lesson 47 - Creating the Components

To create a component, use `ng generate component <componentName>`.

This creates the bellow files and adds this to the AppModules declarations

- componentName.component.ts
- componentName.component.spec.ts
- componentName.component.html
- componentName.component.css
