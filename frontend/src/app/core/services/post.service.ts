import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IPost } from '../interfaces/models/post.model.interface';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  backUrl = environment.BACKEND_API_URL + '/api/posts';
  httpClient = inject(HttpClient);
  constructor() {}

  getPosts() {
    return this.httpClient.get<IPost[]>(this.backUrl);
  }

  getPostBySlug(slug: string) {
    return this.httpClient.get<IPost>(`${this.backUrl}/slug/${slug}`);
  }
}
