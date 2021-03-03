# Section 23 Deploying an Angular App

## Deployment

### Lesson 339 - Module Introduction

After development, to make the application available to the public, we need to deploy it to a server, so people can visit using the domain from the web.

### Lesson 340 - Deployment Preparation & Steps

Deployment steps

1. Use and check environment variables
2. Polish and test the code
3. `ng build --prod` to use AoT compilation to build the code into dist directory
4. Deploy build artifacts to static host
   1. **Static Host** - a web server that is capable of serving HTML/JS/CSS, but not capable of running any server side language (PHP / NodeJS).

### Lesson 341 - Using Environment Variables

Environment Variables are available for all Angular projects created / built with the Angular CLI.

In the `environments` directory under `src`, there are 2 files - `environment.ts` and `environment.prod.ts`. These files contain a `environment` object of environment variables in the form of key-value pairs. Depending on the environment (prod vs dev), Angular CLI swaps between the files to provide the application with different environment variables.

To use the environment variables, import it from `src/environments/environment`, and Angular will swap the env settings base on the build environment.

In `app.component.ts`

```ts
import { environment } from 'src/environments/environment';
@Component({ ... })
export class AppComponent implements OnInit {
  ngOnInit(): void {
    ...;
    console.log(environment.production);
  }
}
```

### Lesson 342 - Deployment Example: Firebase Hosting

After building the prod distribution bundle using `ng build --prod`, the project is ready for deployment.

There are multiple web services that can host static web servers. Some examples are AWS S3 and Firebase. For this course, we use Firebase.

1. `npm install -g firebase-tools` - Install Firebase CLI
2. `firebase login` - Log into Firebase
3. `firebase init` - Connect the local project with a Firebase project
   1. Select Hosting to host the static website
   2. Select the Firebase project to connect to
   3. Set the public directory as the generated bundle folder under `dist`. I.e. `dist/course-project`
   4. Choose Yes to configure the project as a single page app
   5. Do not override the existing HTML file
4. `firebase deploy` - Deploy the firebase project
   1. This will return a URL that is hosting the application

### Lesson 343 - Server Routing vs Browser Routing

When deploying an Angular app, it's important to make sure the hosting server (like S3) is configured to always serve the index.html file. This is so that the server can redirect the route to Angular so it doesn't throw 404s because the server cannot find the route.
