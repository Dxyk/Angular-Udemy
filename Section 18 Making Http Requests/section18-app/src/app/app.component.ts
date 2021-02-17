import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from './post.model';
import { PostsService } from './services/posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];

  isFetching = false;

  error = null;

  private errorSubscription: Subscription;

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.errorSubscription = this.postsService.error.subscribe(
      (errorMessage: string) => {
        this.error = errorMessage;
      }
    );
    this.fetchPosts();
  }

  onCreatePost(postData: Post): void {
    // Send Http request
    this.postsService.storePost(postData.title, postData.content);
  }

  onFetchPosts(): void {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts(): void {
    // Send Http request
    this.postsService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }

  private fetchPosts(): void {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(
      (posts: Post[]) => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      (error: any) => {
        this.error = error.message;
      }
    );
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }
}
