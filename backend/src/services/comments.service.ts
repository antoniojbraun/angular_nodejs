import { Comment } from "../models/Comment";
import { User } from "../models/User";

export async function getAllCommentsService(postId: number) {
  const comments = await Comment.findAll({
    where: { postId },

    include: {
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
    order: [["createdAt", "DESC"]],
  });
  return comments;
}

export async function getCommentByIdService(id: number) {
  const comment = await Comment.findByPk(id, {
    include: {
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
  });
  return comment;
}

export async function addCommentService(
  userId: number,
  postId: number,
  content: string
) {
  const comment = new Comment();
  comment.userId = userId;
  comment.postId = postId;
  comment.content = content;
  const createdComment = await comment.save();
  return createdComment;
}

export async function updateCommentService(id: number, content: string) {
  const comment = await Comment.findByPk(id);
  if (!comment) throw new Error("Comment not found!");
  if (content) comment.content = content;
  await comment.save();
  return comment;
}

export async function deleteCommentService(id: number) {
  const comment = await Comment.findByPk(id);
  if (!comment) throw new Error("Comment not found!");
  const deletedComment = await Comment.destroy({ where: { id } });
  return deletedComment;
}
