export interface IComment {
  id: number;
  content: string;
  userId: number;
  postId: number;
  user: { name: string };
  createdAt: string;
}
