# Section 9 Using Services & Dependency Injection

## Services and Dependency Injection

### Lesson 104 - Module Introduction

In Angular, **Services** provide centralized code and business logic that can be utilized by other components.

### Lesson 105 - Why would you Need Services

Services can help with passing data between components

### Lesson 106 - Creating a Logging Service

A service should have file names of `serviceName.service.ts`. A service is just a class, and does not need a decorator.

In `services/logging.service.ts`,

```ts
export class LoggingService {
  logStatusChange(status: string) {
    console.log('A server status changed, new status: ' + status);
  }
}
```
