import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('signUpForm', { static: false })
  public signUpForm: NgForm;

  public subscriptions = ['Basic', 'Advanced', 'Pro'];
  public selectedSubscription = 'Advanced';

  public onSubmit(): void {
    console.log(this.signUpForm);
  }
}
