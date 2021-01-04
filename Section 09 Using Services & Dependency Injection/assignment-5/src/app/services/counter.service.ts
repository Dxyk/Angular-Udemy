import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  activeToInactiveCount = 0;
  inactiveToActiveCount = 0;

  constructor() {}

  incrementActiveToInactive() {
    this.activeToInactiveCount++;
    console.log('Active to Inactive: ' + this.activeToInactiveCount);
  }

  incrementInactiveToActive() {
    this.inactiveToActiveCount++;
    console.log('Inactive to Active: ' + this.inactiveToActiveCount);
  }
}
