import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FirebaseConfigs } from './constants/firebase-configs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

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

  onCreatePost(postData: Post): void {
    // Send Http request
    this.http
      .post<{ name: string }>(
        FirebaseConfigs.FIREBASE_URL + '/' + FirebaseConfigs.POSTS_ENDPOINT,
        postData
      )
      .subscribe((responseData: { name: string }) => {
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
      .get<{ [key: string]: Post }>(
        FirebaseConfigs.FIREBASE_URL + '/' + FirebaseConfigs.POSTS_ENDPOINT
      )
      .pipe(
        map((responseData: { [key: string]: Post }) => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          return postArray;
        })
      )
      .subscribe((posts: Post[]) => {
        console.log(posts);
      });
  }
}
