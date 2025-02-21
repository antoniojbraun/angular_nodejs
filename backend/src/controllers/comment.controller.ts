import { Request, Response } from "express";
import {
  addCommentService,
  deleteCommentService,
  getAllCommentsService,
  getCommentByIdService,
  updateCommentService,
} from "../services/comments.service";
import { z } from "zod";
import { getPostByIdService } from "../services/post.service";
import { getUserById } from "../services/user.service";
import { User } from "../models/User";

export const getPostCommentsController = async (
  req: Request,
  res: Response
) => {
  const schema = z.object({
    postId: z.number(),
  });
  const schemaValidator = schema.safeParse({
    postId: parseInt(req.params.postId),
  });
  if (!schemaValidator.success) {
    res
      .status(400)
      .json({ message: "Invalid data", errors: schemaValidator.error });
    return;
  }
  const { postId } = schemaValidator.data;
  const post = await getPostByIdService(postId);
  if (!postId) {
    res.status(400).json({ message: "Post ID not found!" });
  }
  const comments = await getAllCommentsService(postId);
  res.json(comments);
};

export const addCommentController = async (req: Request, res: Response) => {
  // Using zod to validate the data coming from forms
  const schema = z.object({
    postId: z.number(),
    content: z.string(),
  });
  const schemaValidator = schema.safeParse(req.body);
  if (!schemaValidator.success) {
    res
      .status(400)
      .json({ message: "Invalid data", errors: schemaValidator.error });
    return;
  }
  const { postId, content } = req.body;
  // Check if the postId exists
  const postIdExists = getPostByIdService(postId);
  if (!postIdExists) {
    res.status(400).json({ message: "Post ID not found!" });
    return;
  }
  // Get the user id from the request
  const user = (req as any).user as User;
  const userId = user.get("id");
  // Add the comment
  const commentCreated = await addCommentService(userId, postId, content);
  res.json(commentCreated);
  return;
};

export const updateCommentController = async (req: Request, res: Response) => {
  // Using zod to validate the data coming from forms
  const schema = z.object({
    id: z.number(),
    postId: z.number(),
    content: z.string(),
  });
  const schemaValidator = schema.safeParse(req.body);
  if (!schemaValidator.success) {
    res
      .status(400)
      .json({ message: "Invalid data", errors: schemaValidator.error });
    return;
  }

  const { id, postId, content } = req.body;

  // Verify if the comment exists
  const commentExists = await getCommentByIdService(id);
  if (!commentExists) {
    res.status(400).json({ message: "Comment ID not found!" });
    return;
  }
  // Verify if the post exists
  const postIdExists = await getPostByIdService(postId);
  if (!postIdExists || postId !== commentExists?.postId) {
    res.status(400).json({ message: "Post ID not found!" });
    return;
  }
  // Get the user id from the request
  const user = (req as any).user as User;
  const userId = user.get("id");

  // Verify if the userId is authorized to edit the comment
  if (userId !== commentExists?.userId) {
    res
      .status(400)
      .json({ message: "User ID is not authorized to edit this comment!" });
    return;
  }

  const upadtedComment = await updateCommentService(id, content);
  res.json(upadtedComment);
};

// Delete comment controller
export const deleteCommentController = async (req: Request, res: Response) => {
  // Using zod to validate the data coming from forms
  const schema = z.object({
    id: z.number(),
  });
  const schemaValidator = schema.safeParse(req.body);
  if (!schemaValidator.success) {
    res
      .status(400)
      .json({ message: "Invalid data", errors: schemaValidator.error });
    return;
  }

  let { id } = schemaValidator.data;

  // Verify if the comment exists
  const commentExists = await getCommentByIdService(id);
  if (!commentExists) {
    res
      .status(400)
      .json({ deletedComment: 0, message: "Comment ID not found!" });
    return;
  }

  // Get the user id from the request
  const user = (req as any).user as User;
  const userId = user.get("id");

  // Verify if the userId is authorized to delete the comment
  if (userId !== commentExists?.userId) {
    res
      .status(400)
      .json({ message: "User ID is not authorized to delete this comment!" });
    return;
  }

  // Delete the comment
  const deletedComment = await deleteCommentService(id);
  res.json({ deletedComment, message: "Comment deleted!" });
};
