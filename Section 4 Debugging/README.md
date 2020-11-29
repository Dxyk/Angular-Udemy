# Section 4 Debugging

## Debugging

### Lesson 60 - Understanding Angular Error Messages

When running the Angular app locally, Browser -> developer console shows the error messages.

E.g. The following error message suggests that there is a TypeError in `app.component.ts`, at line 12, where we're trying to push to something that is not defined. In this case, it is because the array is not initialized.

```text
ERROR TypeError: Cannot read property 'push' of undefined
    at AppComponent.push../src/app/app.component.ts.AppComponent.onAddServer (app.component.ts:12)
    at AppComponent_Template_button_click_5_listener (template.html:5)
```

### Lesson 61 - Debugging Code in the Browser Using Sourcemaps

**Sourcemaps** are Angular-Cli supported additions that map compiled JS code to TS code.

To debug logical bugs, go to developer tools -> Sources and find the TS code under `webpack/./src/app`. Putting breakpoints there will allow stepping through the TS code at runtime.

### Lesson 62 - Using Augury to Dive into Angular Apps

Augury is a Chrome extension for debugging Angular apps.
