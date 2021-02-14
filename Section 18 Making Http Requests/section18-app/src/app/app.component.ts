import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FirebaseConfigs } from './constants/firebase-configs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  loadedPosts = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getPosts();
  }

  onCreatePost(postData: { title: string; content: string }): void {
    // Send Http request
    this.http
      .post(
        FirebaseConfigs.FIREBASE_URL + '/' + FirebaseConfigs.POSTS_ENDPOINT,
        postData
      )
      .subscribe((responseData: object) => {
        console.log(responseData);
      });
  }

  onFetchPosts(): void {
    // Send Http request
    this.getPosts();
  }

  onClearPosts(): void {
    // Send Http request
  }

  private getPosts(): void {
    this.http
      .get(FirebaseConfigs.FIREBASE_URL + '/' + FirebaseConfigs.POSTS_ENDPOINT)
      .pipe(
        map((responseData: object) => {
          const postArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          return postArray;
        })
      )
      .subscribe((posts: any[]) => {
        console.log(posts);
      });
  }
}
