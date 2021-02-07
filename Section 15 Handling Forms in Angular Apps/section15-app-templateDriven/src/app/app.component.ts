import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('formElement')
  signUpForm: NgForm;

  defaultQuestion = 'pet';

  suggestUserName(): void {
    const suggestedName = 'Superuser';
  }

  // onSubmit(formElement: NgForm): void {
  //   console.log(formElement);
  // }

  onSubmit(): void {
    console.log(this.signUpForm);
  }
}
