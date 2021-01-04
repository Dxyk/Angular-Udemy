import { Component } from '@angular/core';
import { CounterService } from './services/counter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private counterService: CounterService) {}

  getActiveToInactiveCount(): number {
    return this.counterService.activeToInactiveCount;
  }

  getInactiveToActiveCount(): number {
    return this.counterService.inactiveToActiveCount;
  }
}
