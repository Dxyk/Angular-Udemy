import { Component } from '@angular/core';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
})
export class ServerComponent {
  serverId = 10;
  serverIsUp = true;
  serverStatusOnline = 'online';
  serverStatusOffline = 'offline';
  serverStatus: string;

  constructor() {
    this.serverStatus =
      Math.random() > 0.5 ? this.serverStatusOnline : this.serverStatusOffline;
  }

  getServer() {
    return 'Server';
  }

  getColor() {
    return this.serverStatus === this.serverStatusOnline
      ? 'chartreuse'
      : 'palevioletred';
  }
}
