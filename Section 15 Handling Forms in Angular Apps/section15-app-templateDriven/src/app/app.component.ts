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

  submitted = false;

  user = {
    username: '',
    email: '',
    secretQuestion: '',
    secretAnswer: '',
    gender: '',
  };

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
        username: suggestedName,
      },
    });
  }

  // onSubmit(formElement: NgForm): void {
  //   console.log(formElement);
  // }

  onSubmit(): void {
    this.submitted = true;
    this.user.username = this.signUpForm.value.userData.username;
    this.user.email = this.signUpForm.value.userData.email;
    this.user.secretQuestion = this.signUpForm.value.secret;
    this.user.secretAnswer = this.signUpForm.value.questionAnswer;
    this.user.gender = this.signUpForm.value.gender;

    this.signUpForm.reset();
  }
}
