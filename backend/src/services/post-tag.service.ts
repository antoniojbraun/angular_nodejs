import { PostTag } from "../models/PostTag";

export async function addPostTags (postId:number, tagsIds:number[]){
    const data:any = tagsIds.map((tagId) => ({
        postId,
        tagId
    }))
   return await PostTag.bulkCreate(data)
}