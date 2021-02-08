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

  genders = ['male', 'female'];

  answer = '';

  suggestUserName(): void {
    const suggestedName = 'Superuser';
    // this.signUpForm.setValue({
    //   userData: {
    //     username: suggestedName,
    //     email: ''
    //   },
    //   secret: 'pet',
    //   questionAnswer: '',
    //   gender: 'male'
    // });
    this.signUpForm.form.patchValue({
      userData: {
        username: suggestedName
      }
    });
  }

  // onSubmit(formElement: NgForm): void {
  //   console.log(formElement);
  // }

  onSubmit(): void {
    console.log(this.signUpForm);
  }
}
