import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  suggestUserName(): void {
    const suggestedName = 'Superuser';
  }

  onSubmit(formElement: NgForm): void {
    console.log(formElement);
  }
}
