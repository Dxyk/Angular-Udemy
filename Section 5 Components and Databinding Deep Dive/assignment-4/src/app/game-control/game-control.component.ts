import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-game-control',
  templateUrl: './game-control.component.html',
  styleUrls: ['./game-control.component.css'],
})
export class GameControlComponent implements OnInit {
  @Output()
  gameStartEvent = new EventEmitter<number>();

  interval;

  count = 0;

  constructor() {}

  ngOnInit(): void {}

  onGameStart() {
    this.interval = setInterval(() => {
      this.gameStartEvent.emit(this.count);
      this.count++;
    }, 1000);
  }

  onGameEnd() {
    clearInterval(this.interval);
  }
}
