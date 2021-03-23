import { Component, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertComponent } from './alert/alert.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  content = null;

  constructor(injector: Injector, domSanitizer: DomSanitizer) {
    const alertElement = createCustomElement(AlertComponent, {
      injector,
    });

    customElements.define('my-alert', alertElement);

    setTimeout(() => {
      this.content = domSanitizer.bypassSecurityTrustHtml(
        '<my-alert message="This is a normal Angular Component."></my-alert>');
    }, 1000);
  }
}
