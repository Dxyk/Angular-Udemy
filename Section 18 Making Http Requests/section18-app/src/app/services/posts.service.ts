import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { FirebaseConfigs } from '../constants/firebase-configs';
import { Post } from '../post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private http: HttpClient) {}

  storePost(title: string, content: string): void {
    const postData: Post = { title, content };
    this.http
      .post<{ name: string }>(
        FirebaseConfigs.FIREBASE_URL + '/' + FirebaseConfigs.POSTS_ENDPOINT,
        postData
      )
      .subscribe((responseData: { name: string }) => {
        console.log(responseData);
      });
  }

  fetchPosts() {
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
      .subscribe((posts: Post[]) => {});
  }
}
