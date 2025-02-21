import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IComment } from '../interfaces/models/comment.model.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  backUrl = environment.BACKEND_API_URL + '/api/comments';
  httpClient = inject(HttpClient);

  getPostComments(postid: number) {
    return this.httpClient.get<IComment[]>(`${this.backUrl}/${postid}`);
  }

  createComment({
    content,
    postId,
    userId,
  }: {
    content: string;
    postId: number;
    userId: number;
  }) {
    return this.httpClient.post<IComment>(`${this.backUrl}`, {
      content,
      postId,
      userId,
    });
  }

  constructor() {}
}
