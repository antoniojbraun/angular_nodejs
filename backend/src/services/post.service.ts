import { Category } from "../models/Category";
import { Comment } from "../models/Comment";
import { Post } from "../models/Post";
import { Tag } from "../models/Tag";
import { User } from "../models/User";

export async function getAllPostsService(filters: {
  categoryId?: string;
  tagId?: string;
  userId?: string;
}) {
  let where: any = {};
  if (filters.categoryId) where.categoryId = Number(filters.categoryId);
  if (filters.userId) where.userId = Number(filters.userId);

  let post = await Post.findAll({
    where,
    include: [
      Category,
      {
        model: User,
        attributes: {
          exclude: ["password"],
        },
      },
      {
        model: Tag,
        where: filters.tagId
          ? {
              id: filters.tagId,
            }
          : undefined,
      },
      {
        model: Comment,
        include: [
          {
            model: User,
            attributes: {
              exclude: [
                "id",
                "email",
                "password",
                "status",
                "createdAt",
                "updatedAt",
              ],
            },
          },
        ],
      },
    ],
  });
  // Remove the password from the user`s data of the post.
  return post;
}

export async function getPostByIdService(id: number) {
  const post = await Post.findByPk(id, {
    include: [
      Category,
      {
        model: User,
        attributes: { exclude: ["password"] },
      },
      Tag,
      {
        model: Comment,
        include: [
          {
            model: User,
            attributes: {
              exclude: [
                "id",
                "email",
                "password",
                "status",
                "createdAt",
                "updatedAt",
              ],
            },
          },
        ],
      },
    ],
  });
  return post;
}

export async function getPostBySlugService(slug: string) {
  const post = await Post.findOne({
    where: { slug },
    include: [
      Category,
      {
        model: User,
        attributes: { exclude: ["password"] },
      },
    ],
  });
  return post;
}

export async function getPostByTagService(tagId: string) {
  // const posts = await Post.findOne({ where: { tags: } });
  // return posts;
}

export async function addPostService(
  title: string,
  content: string,
  slug: string,
  userId: number,
  categoryId: number
) {
  const post = new Post();
  post.title = title;
  post.content = content;
  post.slug = slug;
  post.userId = userId;
  post.categoryId = categoryId;
  await post.save();
  return post;
}

export async function updatePostService(
  id: number,
  title?: string,
  content?: string,
  slug?: string,
  categoryId?: number
) {
  const post = await Post.findByPk(id);
  if (!post) throw new Error("Post not found");

  if (title) post.title = title;
  if (content) post.content = content;
  if (slug) post.slug = slug;
  if (categoryId) post.categoryId = categoryId;

  await post.save();
  return post;
}

export async function deletePostService(id: number) {
  const post = await Post.findByPk(id);
  if (!post) throw new Error("Post not found!");
  const deletedPost = await Post.destroy({ where: { id } });
  return deletedPost;
}
function fn(arg0: string, arg1: any, arg2: string): string {
  throw new Error("Function not implemented.");
}
