import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IPost } from '../../../../core/interfaces/models/post.model.interface';
import { PostService } from '../../../../core/services/post.service';
import moment from 'moment';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent {
  route = inject(ActivatedRoute);
  slug = '';
  post: IPost = {} as IPost;
  moment = moment;
  postsService = inject(PostService);
  constructor() {
    this.route.params.subscribe((params) => {
      this.slug = params['slug'];
    });

    this.postsService.getPostBySlug(this.slug).subscribe((data) => {
      this.post = data;
    });
  }
}
