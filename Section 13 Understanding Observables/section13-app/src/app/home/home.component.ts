import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private firstObsSubscription: Subscription;

  constructor() {}

  ngOnInit() {
    // this.firstObsSubscription = interval(1000).subscribe((count) => {
    //   console.log(count);
    // });
    // const customIntervalObservable = Observable.create((observer) => {
    //   let count = 0;
    //   setInterval(() => {
    //     observer.next(count);
    //     count++;
    //   }, 1000);
    // });

    const customIntervalObservable: Observable<number> = new Observable(
      (subscriber: Subscriber<number>) => {
        let count = 0;
        setInterval(() => {
          // next
          subscriber.next(count);
          // complete
          if (count === 3) {
            subscriber.complete();
          }
          // error
          if (count > 3) {
            subscriber.error(new Error('Count is greater than 3!'));
          }
          count++;
        }, 1000);
      }
    );

    this.firstObsSubscription = customIntervalObservable.subscribe(
      (count) => {
        console.log(count);
      },
      (error: Error) => {
        console.error(error.message);
      },
      () => {
        console.log('Completed!');
      }
    );
  }

  ngOnDestroy() {
    this.firstObsSubscription.unsubscribe();
  }
}
