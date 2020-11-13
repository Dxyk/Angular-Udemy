import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // styleUrls: ['./app.component.css']
  styles: [`
    .white-text {
      color: white
    }
  `]
})
export class AppComponent {

  showSecret = false;
  countList = [];
  count: number;

  onButtonClickEvent(): void {
    this.showSecret = !this.showSecret;
    this.countList.push(this.countList.length + 1);
  }

  getColor(count: number): string {
    return count >= 5 ? 'blue' : 'transparent';
  }

}
