import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import moment from 'moment';
import { IPost } from '../../../../core/interfaces/models/post.model.interface';
import { IPostTag } from '../../../../core/interfaces/models/post-tag.model.interface';
import { IComment } from '../../../../core/interfaces/models/comment.model.interface';
import { PostService } from '../../../../core/services/post.service';
import { TagService } from '../../../../core/services/tag.service';
import { CommentService } from '../../../../core/services/comment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { share } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent {
  slug = '';
  moment = moment;

  route = inject(ActivatedRoute);
  postsService = inject(PostService);
  postTagsService = inject(TagService);
  commentsService = inject(CommentService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  form = this.fb.group({
    content: ['', [Validators.required, Validators.minLength(6)]],
  });

  post: IPost = {} as IPost;
  postTags: IPostTag[] = [];
  comments: IComment[] = [];

  constructor() {
    this.route.params.subscribe((params) => {
      let slug = params['slug'];
      this.loadPost(slug);
    });
  }

  loadPost(slug: string) {
    this.postsService.getPostBySlug(slug).subscribe((data) => {
      this.post = data;

      this.loadTags();
      this.loadComments();
    });
  }
  loadTags() {
    if (this.post) {
      this.postTagsService.getPostTags(this.post.id).subscribe((data) => {
        this.postTags = data;
      });
    }
  }
  loadComments() {
    if (this.post) {
      this.commentsService.getPostComments(this.post.id).subscribe((data) => {
        this.comments = data;
      });
    }
  }

  submitComment() {
    const userId = this.authService.session?.user.id;
    const content = this.form.get('content')?.value;
    const postId = this.post.id;

    const ob = this.commentsService
      .createComment({
        content: content!,
        userId: userId!,
        postId: postId!,
      })
      .pipe(share());

    ob.subscribe({
      next: (res) => {
        this.loadComments();
        this.form.reset();
      },
      error: (err) => {
        if (err && err.error && err.error.message) alert(err.error.message);
      },
    });
    return ob;
  }
}
