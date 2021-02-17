import { Component, OnInit } from '@angular/core';
import { Post } from './post.model';
import { PostsService } from './services/posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];

  isFetching = false;

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService.fetchPosts();
  }

  onCreatePost(postData: Post): void {
    // Send Http request
    this.postsService.storePost(postData.title, postData.content);
  }

  onFetchPosts(): void {
    // Send Http request
    this.postsService.fetchPosts();
  }

  onClearPosts(): void {
    // Send Http request
  }
}
