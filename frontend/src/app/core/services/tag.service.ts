import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IPostTag } from '../interfaces/models/post-tag.model.interface';
import { ITag } from '../interfaces/models/tag.model.interface';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  backUrl = environment.BACKEND_API_URL + '/api/tags';
  httpClient = inject(HttpClient);

  getPostTags(postid: number) {
    return this.httpClient.get<IPostTag[]>(
      `${this.backUrl}/getposttagrelation/${postid}`
    );
  }

  getTagBySlug(slug: string) {
    return this.httpClient.get<ITag>(`${this.backUrl}/gettagbyslug/${slug}`);
  }

  constructor() {}
}
