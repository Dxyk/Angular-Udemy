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
