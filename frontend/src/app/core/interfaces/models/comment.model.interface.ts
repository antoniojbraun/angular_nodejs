import { IUser } from './user.model.interface';

export interface IComment {
  id: number;
  content: string;
  userId: number;
  postId: number;
  user: IUser;
  createdAt: string;
}
