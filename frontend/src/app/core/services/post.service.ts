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

  getPosts(filters: { categoryId?: number; tagId?: number; userId?: number }) {
    // convert every filter to a query parameter and apend to the url

    let url = this.backUrl;
    const params = new URLSearchParams();
    if (filters.categoryId) {
      let categoryId = filters.categoryId.toString();
      params.set('categoryId', categoryId);
    }
    if (filters.tagId) {
      let tagId = filters.tagId.toString();
      params.set('tagId', tagId);
    }

    url += '?' + params.toString();
    return this.httpClient.get<IPost[]>(url);
  }

  getPostBySlug(slug: string) {
    return this.httpClient.get<IPost>(`${this.backUrl}/slug/${slug}`);
  }
}
