import { PostTag } from "../models/PostTag";
import { Tag } from "../models/Tag";

export async function addPostTags(postId: number, tagsIds: number[]) {
  const data: any = tagsIds.map((tagId) => ({
    postId,
    tagId,
  }));
  return await PostTag.bulkCreate(data);
}

export async function getPostTags(postId: number) {
  return await PostTag.findAll({
    include: [Tag],
    where: {
      postId,
    },
  });
}
