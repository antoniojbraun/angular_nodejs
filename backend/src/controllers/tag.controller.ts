import { Request, Response } from "express";
import {
  addTagService,
  deleteTagService,
  getAllTagsService,
  getTagById,
  getTagBySlugService,
  updateTagService,
} from "../services/tag.service";
import { z } from "zod";
import { generateSlug } from "../shared/general.util";
import { getPostByIdService } from "../services/post.service";
import { getPostTags } from "../services/post-tag.service";

export const getTagsController = async (req: Request, res: Response) => {
  const tags = await getAllTagsService();
  res.status(200).json(tags);
};

export const addTagController = async (req: Request, res: Response) => {
  // Using zod to validate the data coming from forms
  const schema = z.object({
    name: z.string(),
    userId: z.number(),
  });
  const schemaValidator = schema.safeParse(req.body);

  if (!schemaValidator.success) {
    res
      .status(400)
      .json({ message: "Invalid data", errors: schemaValidator.error });
    return;
  }

  const { name, userId } = req.body;
  let slug = generateSlug(name);
  const tagAlreadyExistsBySlug = await getTagBySlugService(slug);
  if (tagAlreadyExistsBySlug) slug = generateSlug(name, true);

  const tag = await addTagService(name, slug, userId);
  res.json(tag);
};

export const updateTagController = async (req: Request, res: Response) => {
  // Using zod to validate the data coming from forms
  const schema = z.object({
    name: z.string(),
    id: z.number(),
  });
  const schemaValidator = schema.safeParse(req.body);
  if (!schemaValidator.success) {
    res
      .status(400)
      .json({ message: "Invalid data", errors: schemaValidator.error });
    return;
  }

  const { name, id } = req.body;
  const tagById = await getTagById(id);

  if (!tagById) {
    res.status(400).json({ message: "Tag not found" });
    return;
  }

  if (tagById?.name == name) {
    res.status(400).json({ message: "Nothing was changed" });
    return;
  }

  let slug = generateSlug(name);
  const tagExistBySlug = await getTagBySlugService(slug);
  if (tagExistBySlug) slug = generateSlug(name, true);

  const updatedTag = await updateTagService(name, slug, id);
  res.json(updatedTag);
  return;
};

export const deleteTagController = async (req: Request, res: Response) => {
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
  const verifyTagById = await getTagById(id);
  if (!verifyTagById) {
    res.status(400).json({ message: "Tag not found!" });
    return;
  }

  let deleteTagById = await deleteTagService(id);
  if (deleteTagById == 1) {
    res.status(200).json({ message: "Tag deleted sucessfully" });
    return;
  }
};

export const getPostTagsController = async (req: Request, res: Response) => {
  const postId = Number(req.params.postId);
  if (!postId) {
    res.status(400).json({ message: "Post id is required" });
    return;
  }
  const post = await getPostByIdService(postId);
  if (!post) {
    res.status(400).json({ message: "Post not found" });
    return;
  }
  const postTags = await getPostTags(postId);
  res.json(postTags);
  return;
};
