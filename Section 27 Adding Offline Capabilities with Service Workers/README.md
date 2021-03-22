# Section 27 Adding Offline Capabilities with Service Workers

## Service Workers

### Lesson 415 - Module Introduction

**Service Workers** help make the online-only Angular app available for offline use.

To make an application run offline in Chrome, in the developer tools -> Application tab -> Service Workers, select Offline. This will simulate the page without internet connection without the need to disconnect the machine's internet connection.

### Lesson 416 - Adding Service Workers

JS applications usually run on a single thread, attached to individual HTML pages (although JS has features to run asynchronous tasks to not block code execution). It is possible to run **Web Workers** (Service Workers are a special type of Web Workers) that run on additional thread which is decoupled from HTML pages.

These Web Workers can be run in the background and can be used for advanced features such as receiving push notifications, etc.

More importantly, these Web Workers can also manage all the pages of the given scope and listen to request (including requests for the page source file and API requests) going out of the pages. Specifically, they can cache these requests and their responses, so when the internet connection breaks, the page can still load using the cached responses.

Angular provides a third party package `@angular/pwa` that allows applications to add Service Workers. To add, use `ng add @angular/pwa`. This command installs the module and generates/updates files to configure the application to use Service Workers.

In `app.module.ts`

- `@angular/pwa` adds the `ServiceWorkerModule` to the `AppModule`'s `imports` lists
  - The `ServiceWorkerModule` registers the `ngsw-worker.js` file
    - This file will be generated to the `dist` directory when the application is built
    - The file contains many Service Worker features that come with the package
  - The ServiceWorkerModule is only enabled when the application is run in production mode

```ts
@NgModule({
  ...,
  imports: [
    ...,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
})
export class AppModule {}
```

In `app.component.html`

- Add a hard-coded header to show that the Service Worker works

```html
<h1>My Posts</h1>
```

To see Service Workers work in action, do the following

1. Build the prod version of the application using `ng build --prod`
2. Use `npm install -g http-server` to install a simple server that supports running Node-based servers
3. `cd ./dist/<projectName>`
4. `http-server -p 8081` to host the server on port `8081`
5. Visit [http://localhost:8081](http://localhost:8081) to access the hosted application

In the developer console -> Application -> Service Workers tab, it will now show the running Service Workers. By checking the `offline` checkbox and reloading, although the page only shows the hard-coded header, we can see that the browser is actually loading parts of the application. In the Network tab, there are requests being sent out that are related to the application. In the `Size` column, all success requests are loaded from Service Worker.

### Lesson 417 - Caching Assets for Offline Use

The `ngsw-config.json` file is generated when the `@angular/pwa` package was added. It contains the Service Worker configurations.

In `ngsw-config.json`

- `index` indicates the landing page of the application
  - In this case, `/index.html`
- `assetGroups` is an array of asset groups
  - Asset groups define how and which static assets should be cached
    - The HTML file and the code, which gets built once and never changes again
    - Dynamic assets are data that are loaded using APIs or http requests
  - Each asset group is an JS object that
    - `name` - the name of the asset group
    - `installMode` - how the assets should be loaded
      - `prefetch` - load the assets in the cache whenever the server loads, even the application has not needed them yet
      - `lazy` - load the asset only when the asset is actually needed
    - `updateMOde` - how the assets should be loaded when a new version of the application is published
    - `resources` - assets that should be loaded
      - `files` - the file paths that should be loaded for this asset group
      - `urls` - the url paths that should be loaded by the Service Workers
- Extract the font url from `index.html` and add it to the first asset group using the `urls` property

```json
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.html",
          "/manifest.webmanifest",
          "/*.css",
          "/*.js"
        ],
        "urls": ["https://fonts.googleapis.com/css?family=Oswald:300,700"]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/assets/**",
          "/*.(eot|svg|cur|jpg|png|webp|gif|otf|ttf|woff|woff2|ani)"
        ]
      }
    }
  ]
}
```

Previously, when loading the page in offline mode, the fonts were loaded using http requests. Now the fonts are cached using Service Workers.
