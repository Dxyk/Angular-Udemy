import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  oddNums: number[] = [];
  evenNums: number[] = [];

  onGameStarted(count: number) {
    if (count % 2 === 0) {
      this.evenNums.push(count);
    } else {
      this.oddNums.push(count);
    }
  }
}
