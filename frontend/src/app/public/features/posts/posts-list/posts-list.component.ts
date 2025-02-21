import {
  AfterContentInit,
  Component,
  inject,
  Input,
  model,
} from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { PostService } from '../../../../core/services/post.service';
import { IPost } from '../../../../core/interfaces/models/post.model.interface';
import moment from 'moment';
@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
})
export class PostsListComponent implements AfterContentInit {
  @Input() categoryId?: number;
  @Input() tagId?: number;
  @Input() userId?: string;

  posts: IPost[] = [];
  postsService = inject(PostService);
  moment = moment;
  constructor() {}

  ngAfterContentInit(): void {
    this.loadPosts({ categoryId: this.categoryId, tagId: this.tagId });
  }

  loadPosts(filters: { categoryId?: number; tagId?: number; userId?: number }) {
    this.postsService.getPosts(filters).subscribe((data) => {
      this.posts = data;
    });
  }
}
