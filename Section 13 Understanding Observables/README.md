# Section 13 Understanding Observables

## Observables

### Lesson 169 - Module Introduction

**Observables** can be viewed as various data sources. They are in charge of emitting events or data.

Observables can trigger event or data to be emitted through

- A button click
- An HTTP request
- Programmatically by code

**Observers** are subscribed to observables. They respond to events or data emitted by the observables.

Observers can handle 3 types of events or data. The observers can write logic (callback functions) to define how and what should be executed when they receive these events.

- Data
- Error
- Completion
  - An observable does not have to complete. E.g. a button emits data, but the observer will never know when the button is complete, since it may be clicked multiple times.
  - An HTTP request will have a clear END, which tells observers that the request is complete.
