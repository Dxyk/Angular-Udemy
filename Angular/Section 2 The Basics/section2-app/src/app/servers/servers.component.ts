import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servers',
  // selector: '[app-servers]',
  // selector: '.app-servers',
  // template: `
  //   <app-server></app-server>
  //   <app-server></app-server>
  // `,
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css'],
})
export class ServersComponent implements OnInit {
  allowNewServer = false;

  serverCreationStatus = 'There are no servers created';

  serverName = 'testServerName';

  serverCreated = false;

  constructor() {
    setTimeout(() => {
      this.allowNewServer = true;
    }, 2000);
  }

  ngOnInit(): void {}

  onCreateServer(): void {
    this.serverCreated = true;
    this.serverCreationStatus =
      'A server with name of [ ' + this.serverName + ' ] has been created';
  }

  // onUpdateServerName(event: any): void {
  //   this.serverName = (<HTMLInputElement>event.target).value;
  // }
}
