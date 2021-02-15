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

### Lesson 256 - GETting Data

Note on firebase, once a folder is stored using POST, there will be a new key present in the db. Expanding the key shows the post entry.

To send a GET request, similar to POST, use `HttpClient.get(url)` and subscribe to it

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.getPosts();
  }

  onFetchPosts(): void {
    this.getPosts();
  }
  ...
  private getPosts(): void {
    this.http
      .get(FirebaseConfigs.FIREBASE_URL + '/' + FirebaseConfigs.POSTS_ENDPOINT)
      .subscribe((responseData: object) => {
        console.log(responseData);
      });
  }
}
```

By inspecting the output, the returned object is an Object of firebase generated key as keys, and the key-value post object as value.

### Lesson 257 - Using RxJS Operators to Transform Response Data

To map the returned object as a list of posts, use the `pipe()` method with Observable Operators provided by RxJS. These operators happen before the `subscribe()` method, so the `subscribe()` method can contain leaner code that processes returned objects that are already transformed.

In `app.component.ts`

- Use `pipe()` to transform the data we get from the `HttpClient.get()` call.
- Loop through the response data, for each key-post pair
  - Add the post to the array
  - Add an additional `id` field to store the key from the response
  - Note that it is best practice to check `object.hasOwnProperty(property)` in a for-in loop, so we are not accessing properties from the prototype.

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent implements OnInit {
  ...
  private getPosts(): void {
    this.http
      .get(FirebaseConfigs.FIREBASE_URL + '/' + FirebaseConfigs.POSTS_ENDPOINT)
      .pipe(
        map((responseData: object) => {
          const postArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          return postArray;
        })
      )
      .subscribe((posts: any[]) => {
        console.log(posts);
      });
  }
}
```

### Lesson 258 - Using Types with the HttpClient

To let TS know the type of the returned HTTP response type, one way would be to use models and type declarations.

In `post.model.ts`

```ts
export class Post {
  title: string;
  content: string;
  id?: string;
}
```

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent implements OnInit {
  ...
  private getPosts(): void {
    this.http
      .get(FirebaseConfigs.FIREBASE_URL + '/' + FirebaseConfigs.POSTS_ENDPOINT)
      .pipe(
        map((responseData: [key: string]: Post) => { ... })
      )
      .subscribe((posts: Post[]) => {
        console.log(posts);
      });
  }
}
```

Another more elegant way is to declare the type in the generic `HttpClient.get()` method. I.e. `HttpClient.get<Type>()`

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent implements OnInit {
  ...
  private getPosts(): void {
    this.http
      .get<{ [key: string]: Post }>( ... )
      .pipe(
        map((responseData: { [key: string]: Post }) => {
          const postArray: Post[] = [];
          ...
          return postArray;
        })
      )
      .subscribe((posts: Post[]) => {
        console.log(posts);
      });
  }
}
```

### Lesson 259 - Outputting Posts

Assign the fetched post and display them in the webpage

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  ...
  private getPosts(): void {
    this.http
      .get<{ [key: string]: Post }>( ... )
      .pipe(...)
      .subscribe((posts: Post[]) => {
        this.loadedPosts = posts;
      });
  }
}
```

In `app.component.html`

```html
<div class="row">
  <div class="col-xs-12 col-md-6 col-md-offset-3">
    <p *ngIf="loadedPosts.length < 1">No posts available!</p>
    <ul class="list-group" *ngIf="loadedPosts.length >= 1">
      <li class="list-group-item" *ngFor="let post of loadedPosts">
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
      </li>
    </ul>
  </div>
</div>
```
