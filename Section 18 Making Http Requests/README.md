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

### Lesson 260 - Showing a Loading Indicator

Show an indicator when a request is in flight

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent implements OnInit {
  isFetching = false;
  ...
  private getPosts(): void {
    this.isFetching = true;
    this.http
      .get<{ [key: string]: Post }>( ... )
      .pipe(...)
      .subscribe((posts: Post[]) => {
        this.isFetching = false;
        ...
      });
  }
}
```

In `app.component.html`

```html
<p *ngIf="loadedPosts.length < 1 && !isFetching">No posts available!</p>

<ul class="list-group" *ngIf="loadedPosts.length >= 1 && !isFetching">
  <li class="list-group-item" *ngFor="let post of loadedPosts">
    <h3>{{ post.title }}</h3>
    <p>{{ post.content }}</p>
  </li>
</ul>

<p *ngIf="isFetching">Loading ...</p>
```

### Lesson 261 - Using a Service for Http Requests

Components should mostly handle template / display related work. Sending HTTP requests should be outsourced to Services.

In `posts.service.ts`

```ts
import { ... } from '...';

@Injectable({ providedIn: 'root' })
export class PostsService {
  constructor(private http: HttpClient) {}

  storePost(title: string, content: string): void {
    const postData: Post = { title, content };
    this.http
      .post<{ name: string }>(FirebaseConfigs.FIREBASE_URL + '/' + FirebaseConfigs.POSTS_ENDPOINT, postData)
      .subscribe((responseData: { name: string }) => {
        console.log(responseData);
      });
  }

  fetchPosts() {
    this.http
      .get<{ [key: string]: Post }>(FirebaseConfigs.FIREBASE_URL + '/' + FirebaseConfigs.POSTS_ENDPOINT)
      .pipe(
        map((responseData: { [key: string]: Post }) => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          return postArray;
        })
      )
      .subscribe((posts: Post[]) => {});
  }
}
```

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent implements OnInit {
  ...

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService.fetchPosts();
  }

  onCreatePost(postData: Post): void {
    this.postsService.storePost(postData.title, postData.content);
  }

  onFetchPosts(): void {
    this.postsService.fetchPosts();
  }
  ...
}
```

### Lesson 262 - Services & Components Working Together

To connect the data storage in the component and the service, there are two possible ways.

The first is to use `Subject`s in the service and have the component subscribe to it. This is more suitable when there are multiple components listening to the data.

The second is to simply return the `Observable` returned by `HttpClient.get()`, and subscribe it in the component. Reminder that if the Http Request is not subscribed, Angular will not send the request.

In `posts.service.ts`

- Return the `pipe` transformed object as an Observable

```ts
import { ... } from '...';

@Injectable({ providedIn: 'root' })
export class PostsService {
  ...
  fetchPosts(): Observable<Post[]> {
    return this.http
      .get<{ [key: string]: Post }>( ... )
      .pipe( ... );
  }
}
```

In `app.component.ts`

- Subscribe to the `fetchPosts()` method and update necessary flag and data to reflect in the page

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent implements OnInit {
  ...

  ngOnInit(): void {
    this.fetchPosts();
  }

  onFetchPosts(): void {
    this.fetchPosts();
  }

  private fetchPosts(): void {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe((posts: Post[]) => {
      this.isFetching = false;
      this.loadedPosts = posts;
    });
  }
}
```

Note we don't need to apply this to the `onCreatePost()` or `PostsService.storePost()` method because the component does not care about the returned key when the `post` method returns.

### Lesson 263 - Sending a DELETE Request

To enable the Clear Posts button, use HTTP's DELETE verb.

In `posts.service.ts`

```ts
import { ... } from '...';

@Injectable({ providedIn: 'root' })
export class PostsService {
  ...
  deletePosts(): Observable<object> {
    return this.http.delete(
      FirebaseConfigs.FIREBASE_URL + '/' + FirebaseConfigs.POSTS_ENDPOINT
    );
  }
}
```

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent implements OnInit {
  ...
  onClearPosts(): void {
    this.postsService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }
}
```

### Lesson 264 - Handling Errors

To configure Firebase to return an Error

1. Go to the Rules tab
2. Set one of the `read` or `write` values to `false`, or an expression that evaluates as `false`.
3. This will cause the operation to throw 401 Unauthorized.

One of the possible ways to handle HTTP Request Errors is to pass in a second function in the `Observable.subscribe()` method. This is the method that handles failed event.

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent implements OnInit {
  ...
  private fetchPosts(): void {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(
      (posts: Post[]) => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      (error: any) => {
        this.error = error.message;
      }
    );
  }
}
```

In `app.component.html`

```html
<div class="alert alert-danger" *ngIf="error">
  <h1>An Error Occurred</h1>
  <p>{{ error }}</p>
</div>
```

### Lesson 265 - Using Subjects for Error Handling

Another way of handling error is through `Subject`s. This is more appropriate when the component is not subscribed to the service's sent request.

In `posts.service.ts`

```ts
import { ... } from '...';

@Injectable({ providedIn: 'root' })
export class PostsService {
  error = new Subject<string>();
  ...
  storePost(title: string, content: string): void {
    ...
    this.http
      .post<{ name: string }>( ... )
      .subscribe(
        (responseData: { name: string }) => { ... },
        (error: any) => {
          this.error.next(error.error.error);
        }
      );
  }
}
```

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent implements OnInit, OnDestroy {
  private errorSubscription: Subscription;
  ...
  ngOnInit(): void {
    this.errorSubscription = this.postsService.error.subscribe(
      (errorMessage: string) => {
        this.error = errorMessage;
      }
    );
    ...
  }
  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }
  ...
}
```

### Lesson 266 - Using the catchError Operator

Another way of handling errors is through the RxJS operator `catchError`. This is more suitable for handling error in a non-UI related way. E.g. sending data to analytics server, etc.

In `posts.service.ts`

- `catchError` is a RxJS operator
- `throwError` is a RxJS method that yields an Observable of error object

```ts
import { ... } from '...';

@Injectable({ providedIn: 'root' })
export class PostsService {
  ...
  fetchPosts(): Observable<Post[]> {
    return this.http
      .get<{ [key: string]: Post }>( ... )
      .pipe(
        ...,
        catchError((error: any) => {
          // Non-UI related error handling. E.g. send data to analytics server
          return throwError(error);
        })
      );
  }
}
```

### Lesson 267 - Error Handling & UX

It is also common practice to implement UX for user to get rid of the error message.

In `app.component.html`

```html
<button class="btn btn-danger" (click)="onHandleError()">Dismiss</button>
```

In `app.component.ts`

```ts
import { ... } from '...';

@Component({ ... })
export class AppComponent implements OnInit, OnDestroy {
  ...
  onHandleError(): void {
    this.error = null;
  }
  ...
  private fetchPosts(): void {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(
      (posts: Post[]) => {
        this.isFetching = false;
        ...
      },
      (error: any) => {
        this.isFetching = false;
        ...
      }
    );
  }
}
```

### Lesson 268 - Setting Headers

All `HttpClient` methods have a last optional argument that is an object. To configure the Headers in an HTTP Request, use the `headers` field of this object, and construct an `HttpHeaders` object. The constructor takes in an object of key-value pairs of header entries.

To verify a request with the header is sent, go to developer console -> Network -> Headers -> Request Headers

In `posts.service.ts`

```ts
import { ... } from '...';

@Injectable({ providedIn: 'root' })
export class PostsService {
  ...
  fetchPosts(): Observable<Post[]> {
    return this.http
      .get<{ [key: string]: Post }>(
        ...,
        {
          headers: new HttpHeaders({
            'Custom-Header': 'Hello World',
          }),
        }
      )
      .pipe( ... );
  }
}
```
