# Section 18 Making Http Requests

## HTTP Requests

### Lesson 250 - A New IDE

### Lesson 251 - Module Introduction

This module focuses on how to send HTTP requests to communicate with backend server / databases.

### Lesson 252 - How Does Angular Interact With Backend?

Usually, Angular applications communicate with the backend server through HTTP requests, and servers return HTTP responses.

Angular apps should not communicate to databases directly because of security reasons. Since an Angular app is compiled as JS code, anyone accessing the page will be able to see the code, and thus acquire the credentials if it was stored in the Angular app.

### Lesson 253 - The Anatomy of a Http Request

HTTP requests are made out of a few components

1. HTTP Verb
   1. GET, POST, PUT, DELETE, etc
2. URL (API Endpoint)
   1. /users
3. Headers (metadata)
   1. `{ "Content-Type" : "application/json" }`
4. Body - data
   1. Mostly for POST, PUT or PATCH requests

### Lesson 254 - Backend (Firebase) Setup

[Firebase](https://firebase.google.com/) provides a free backend solution (server, db, etc) which we will use in this project.

To set up

1. Go to console
2. Add a project
   1. Add a Name
   2. No need to turn on Google Analytics
   3. Create project
3. Go to Realtime Database
   1. Create Database
   2. Start in Test mode
   3. Enable
4. The URL shown in the Realtime Database is the URL to send requests to for this project

### Lesson 255 - Sending a POST Request

To send HTTP requests through Angular, we need to import the `HttpClientModule` in `AppModule`.

In Firebase, the node/endpoints are generated as folders as an abstraction.

In `app.component.ts`

- Use `HttpClient.post(url, body, options)` to send a POST request
  - Angular will automatically transform the body into json.
- The `post` method returns an `Observable`, which we need to subscribe to in order to be able to process the HTTP response.
  - In fact, the HTTP request will not even get sent by Angular if it detects that the method is not subscribed.
  - Since `HttpClient` is a built-in Angular module, the subscriptions are managed by Angular, so there is no need to unsubscribe.

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}

  onCreatePost(postData: { title: string; content: string }): void {
    // Send Http request
    this.http
      .post(
        FirebaseConfigs.FIREBASE_URL + '/' + FirebaseConfigs.POSTS_ENDPOINT,
        postData
      )
      .subscribe((responseData: object) => {
        console.log(responseData);
      });
  }
  ...
}
```
