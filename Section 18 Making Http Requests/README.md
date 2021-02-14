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
