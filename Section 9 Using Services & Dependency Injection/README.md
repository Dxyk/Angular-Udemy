# Section 9 Using Services & Dependency Injection

## Services and Dependency Injection

### Lesson 104 - Module Introduction

In Angular, **Services** provide centralized code and business logic that can be utilized by other components.

### Lesson 105 - Why would you Need Services

Services can help with passing data between components

Advantages:

- Leaner code - avoid duplicated code

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

### Lesson 107 - Injecting the Logging Service into Components

To use services in components, the service should not be instantiated. Instead, it should be injected in the constructor. Angular offers **Dependency Injector**.

To inject a dependency in the component, there are 2 steps:

1. Declare the service with type in the constructor. `constructor(private service: Service) {}`
   1. When Angular tries to instantiate the component class, it understands that it also needs to provide the service as a dependency.
2. Add `provider: [Service]` in the `@Component` decorator.
   1. The `provider` property tells Angular that it should be able to provide classes listed in it.

In `account.component.ts`

```ts
import { ... } from '...';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [LoggingService],
})
export class AccountComponent {
  ...
  constructor(private loggingService: LoggingService) {}

  onSetTo(status: string) {
    this.statusChanged.emit({ id: this.id, newStatus: status });
    this.loggingService.logStatusChange(status);
  }
}
```
