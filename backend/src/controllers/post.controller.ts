import { Request, Response } from "express";
import {
  addPostService,
  deletePostService,
  getAllPostsService,
  getPostByIdService,
  getPostBySlugService,
  updatePostService,
} from "../services/post.service";
import { array, z } from "zod";
import { generateSlug } from "../shared/general.util";
import { getCategoryById } from "../services/category.service";
import { getTagsByIds } from "../services/tag.service";
import { addPostTags, getPostTags } from "../services/post-tag.service";
import { User } from "../models/User";

export const getPostsController = async (req: Request, res: Response) => {
  // zod schema to accept filters from query variables
  const schema = z.object({
    categoryId: z.string().optional(),
    tagId: z.string().optional(),
    userId: z.string().optional(),
  });
  console.log(req.query);

  // parse the query strings variables
  const schemaValidator = schema.safeParse(req.query);

  if (!schemaValidator.success) {
    res
      .status(400)
      .json({ message: "Invalid data", errors: schemaValidator.error });
    return;
  }

  // get the query strings variables
  const { categoryId, tagId, userId } = schemaValidator.data;
  // get all posts

  const posts = await getAllPostsService({ categoryId, tagId, userId });
  res.json(posts);
};

export const getPostBySlugController = async (req: Request, res: Response) => {
  const slug = req.params.slug;

  const post = await getPostBySlugService(slug);

  if (!post) {
    res.status(400).json({ message: "Post not found" });
    return;
  }

  res.json(post);
};

export const addPostController = async (req: Request, res: Response) => {
  // Using zod to validate the data coming from forms
  const schema = z.object({
    title: z.string(),
    content: z.string(),
    categoryId: z.number(),
    tagIds: array(z.number()).optional(),
  });
  const schemaValidator = schema.safeParse(req.body);
  if (!schemaValidator.success) {
    res
      .status(400)
      .json({ message: "Invalid data", errors: schemaValidator.error });
    return;
  }
  const { title, content, categoryId, tagIds } = req.body;
  // Get the user id from the request
  const user = (req as any).user as User;
  const userId = user.get("id");

  // Check if the tags are valid
  await validateTags(res, tagIds);

  // Check if the category is valid
  const isCategoryIsValid = await getCategoryById(categoryId);
  if (!isCategoryIsValid) {
    res.status(400).json({ message: "Category informed is not valid" });
    return;
  }

  let slug = generateSlug(title);
  const slugAlreadyExists = await getPostBySlugService(slug);
  if (slugAlreadyExists) slug = generateSlug(title, true);
  const post = await addPostService(title, content, slug, userId, categoryId);

  if (tagIds && tagIds.length > 0) {
    await addPostTags(post.id, tagIds);
  }
  res.json(post);
};

export const updatePostController = async (req: Request, res: Response) => {
  // Using zod to validate the data coming from forms
  const schema = z.object({
    id: z.number(),
    title: z.string().optional(),
    content: z.string().optional(),
    categoryId: z.number().optional(),
    tagIds: array(z.number()).optional(),
  });
  const schemaValidator = schema.safeParse(req.body);
  if (!schemaValidator.success) {
    res
      .status(400)
      .json({ message: "Invalid data", errors: schemaValidator.error });
    return;
  }
  let { title, content, id, categoryId, tagIds } = req.body;
  // Get the user id from the request
  const user = (req as any).user as User;
  const userId = user.get("id");

  // Check if the tags are valid
  await validateTags(res, tagIds);

  // Check if the post exist by ID
  const post = await getPostByIdService(id);
  if (!post) {
    res.status(400).json({ message: "Post not found" });
    return;
  }

  // check if user is autorized to update the post
  if (post.userId !== userId) {
    res
      .status(404)
      .json({ message: "You are not authorized to update this post." });
    return;
  }
  if (categoryId) {
    // Check if the category id given exists
    const categoryById = await getCategoryById(categoryId);
    if (!categoryById) {
      res.status(400).json({ message: "Invalid Category." });
      return;
    }
  }
  let slug;
  // Check if the title was updated
  if (title && title !== post.title) {
    slug = generateSlug(title);
    // check if the slug is unique
    let isSlugAvaiable = await getPostBySlugService(slug);
    if (isSlugAvaiable) slug = generateSlug(title, true);
  }

  const updatedPost = await updatePostService(
    id,
    title,
    content,
    slug,
    categoryId
  );

  const postTagRelation = await getPostTags(id);

  if (tagIds && tagIds.length > 0) {
    // check if the tags are different
    tagIds = tagIds.filter((tagId: number) => {
      const postTag = postTagRelation.find((postTagRelation) => {
        return postTagRelation.tagId === tagId;
      });
      return !postTag;
    });

    if (tagIds.length > 0) await addPostTags(post.id, tagIds);
  }

  res.json(updatedPost);
  return;
};

export const deletePostController = async (req: Request, res: Response) => {
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
  const { id } = req.body;
  // Get the user id from the request
  const user = (req as any).user as User;
  const userId = user.get("id");

  // Check if the post exist by ID
  const post = await getPostByIdService(id);
  // Check if the post exist
  if (!post) {
    res.status(400).json({ message: "Post id not found" });
    return;
  }
  // check if user is autorized to delete the post
  if (post.userId !== userId) {
    res
      .status(400)
      .json({ message: "User is not authorized to delete this post" });
    return;
  }

  // delete the post
  const deletedPostById = await deletePostService(id);
  if (deletedPostById == 1) {
    res.status(200).json({ message: "Post deleted sucessfully" });
    return;
  }
};

async function validateTags(res: Response, tagIds?: number[]) {
  if (tagIds && tagIds.length > 0) {
    // check if all tags area valid
    const tags = await getTagsByIds(tagIds);
    if (tags.length !== tagIds.length) {
      res.status(400).json({ message: "Invalid tag id(s)" });
      return;
    }
  }
}
