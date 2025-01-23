import { ICategory } from './category.model.interface';
import { IComment } from './comment.model.interface';
import { ITag } from './tag.model.interface';
import { IUser } from './user.model.interface';

export interface IPost {
  id: number;
  title: string;
  content: string;
  slug: string;
  userId: number;
  user: IUser;
  category: ICategory;
  tags: ITag[];
  comments: IComment[];
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}
