import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PostService } from '../../../../core/services/post.service';
import { IPost } from '../../../../core/interfaces/models/post.model.interface';
import moment from 'moment';
@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
})
export class PostsListComponent {
  posts: IPost[] = [];
  postsService = inject(PostService);
  moment = moment;
  constructor() {
    this.postsService.getPosts().subscribe((data) => {
      this.posts = data;
    });
  }
}
