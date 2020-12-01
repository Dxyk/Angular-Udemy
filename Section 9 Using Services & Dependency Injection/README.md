# Section 9 Using Services & Dependency Injection

## Services and Dependency Injection

### Lesson 104 - Module Introduction

In Angular, **Services** provide centralized code and business logic that can be utilized by other components.

### Lesson 105 - Why would you Need Services

Services are used to

- store centralized code
- store and manage data, pass data between components

Advantages:

- Leaner code - avoid duplicated code
- Utilizes hierarchical injector
- Code readability - Reduces `@Output` and `@Input` usage

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
   1. The `provider` property tells Angular that it should create a new instance for each class listed in this property.
   2. Also used to override existing services from parent components

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

### Lesson 108 - Creating a Data Service

Services are also used to store and manage data. Note: The implementation after this lesson is incomplete because it contains a bug.

In `services/accounts.service.ts`

```ts
export class AccountsService {
  accounts = [];

  addAccount(name: string, status: string) {
    this.accounts.push({ name: name, status: status });
  }

  updateAccount(id: number, status: string) {
    this.accounts[id].status = status;
  }
}
```

In `app.component.ts`

Note: Since arrays are reference types in JS/TS, assigning a variable to the array is equivalent to accessing the exact same array

```ts
import { ... } from '...';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AccountsService],
})
export class AppComponent implements OnInit {
  accounts: { name: string; status: string }[] = [];

  constructor(private accountsService: AccountsService) {}

  ngOnInit() {
    this.accounts = this.accountsService.accounts;
  }
}
```

In `account.component.ts`

```ts
import { ... } from '...';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [LoggingService, AccountsService],
})
export class AccountComponent {
  @Input()
  account: { name: string; status: string };

  @Input()
  id: number;

  constructor(
    private loggingService: LoggingService,
    private accountsService: AccountsService
  ) {}

  onSetTo(status: string) {
    this.accountsService.updateAccount(this.id, status);
    this.loggingService.logStatusChange(status);
  }
}
```

In `new-account.component.ts`

```ts
import { ... } from '...';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
  providers: [LoggingService, AccountsService],
})
export class NewAccountComponent {
  constructor(
    private loggingService: LoggingService,
    private accountsService: AccountsService
  ) {}

  onCreateAccount(accountName: string, accountStatus: string) {
    this.accountsService.addAccount(accountName, accountStatus);
    this.loggingService.logStatusChange(accountStatus);
  }
}
```

### Lesson 109 - Understanding the Hierarchical Injector

Angular **Hierarchical Injector**

- Injecting the service into `AppModule` -> the same instance of the service will be available application-wide (including components and services)
- Injecting the service into `AppComponent` -> the same instance of the service will be available for all components, but not for other services
- Injecting the service into any other component -> the same instance will be available for the component and its child components
  - Will override if the same service is provided at a higher level

### Lesson 110 - How many Instances of Service Should It Be

To specify that a component should inherit an injected service from its parent component, do not include the service in the `provider` property in the `@Component` decorator.

Note the constructor will need to declare the service no matter if we want to create a new instance or not.

To fix the bug mentioned in Lesson 108, remove `AccountService` in the `@Component({provider: [...]})` array for `account.component.ts` and `new-account.component.ts`. Keep it for `app.component.ts`, and this will make the rest of the components inherit the same service.

### Lesson 111 - Injecting Services into Services

By adding a service in `@NgModule(provider: [])` in the `AppModule`, the whole app (both components and services) will have access to the same instance of the service unless the component choose to override it.

To inject a service `ServiceA` into another service `ServiceB`, there are 3 steps

1. Register both service as `providers` in `AppModule`
2. In the constructor for `ServiceB`, declare the service `ServiceA`
3. Add `@Injectable()` decorator to the `serviceB`.
   1. This informs Angular that it should be responsible for dependency injection when constructing `serviceB`.

Note: In newer versions of Angular, all services are recommended to have the `@Injectable` even though it does not require dependency injection.

Remove `provider` for `.*.component.html`

In `app.module.ts`

```ts
import { ... } from '...';

@NgModule({
  declarations: [AppComponent, AccountComponent, NewAccountComponent],
  imports: [BrowserModule, FormsModule],
  providers: [AccountsService, LoggingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

In `accounts.service.ts`

```ts
import { ... } from '...';

@Injectable()
export class AccountsService {
  accounts = [];

  constructor(private loggingService: LoggingService) {}

  addAccount(name: string, status: string) {
    this.loggingService.logStatusChange(status);
    this.accounts.push({ name: name, status: status });
  }

  updateAccount(id: number, status: string) {
    this.loggingService.logStatusChange(status);
    this.accounts[id].status = status;
  }
}
```

### Lesson 112 - Using Services for Cross-Component Communication

Assume component A and its child components B and C. Without using services, for B and C to communicate with each other, B has to emit an event, and A has to catch it, and pass data to C using property binding.

With services, the service S can define an event. Component B can emit the event, and component C can subscribe to it and perform action in the callback method.

In `accounts.service.ts`

```ts
import { ... } from '...';

@Injectable()
export class AccountsService {
  ...

  statusUpdated = new EventEmitter<string>();

  constructor(private loggingService: LoggingService) {}

  ...
}
```

In `account.component.ts` (B)

```ts
import { ... } from '...';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent {
  ...

  constructor(private accountsService: AccountsService) {}

  onSetTo(status: string) {
    ...
    this.accountsService.statusUpdated.emit(status);
  }
}
```

In `new-account.component.ts` (C)

```ts
import { ... } from '...';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
})
export class NewAccountComponent {
  constructor(private accountsService: AccountsService) {
    this.accountsService.statusUpdated.subscribe((status: string) => {
      alert('new status: ' + status);
    });
  }
  ...
}
```

### Lesson 113 - Services in Angular 6+

In Angular 6+, to make a service available application-wide, either register it in `provider` in `AppModule`, or add `@Injectable({providedIn: 'root'})` to the Service
