import { Component, inject } from '@angular/core';
import { PostsListComponent } from '../../posts/posts-list/posts-list.component';
import { ActivatedRoute } from '@angular/router';
import { ITag } from '../../../../core/interfaces/models/tag.model.interface';
import { TagService } from '../../../../core/services/tag.service';

@Component({
  selector: 'app-tag-detail',
  standalone: true,
  imports: [PostsListComponent],
  templateUrl: './tag-detail.component.html',
  styleUrl: './tag-detail.component.scss',
})
export class TagDetailComponent {
  route = inject(ActivatedRoute);
  tagService = inject(TagService);
  tag?: ITag;

  constructor() {
    this.route.params.subscribe((params) => {
      let tagSlug = params['tag'];

      this.loadTag(tagSlug);
    });
  }

  loadTag(tagSlug: string) {
    this.tagService.getTagBySlug(tagSlug).subscribe((data) => {
      this.tag = data;
    });
  }
}
