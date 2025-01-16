import { Request, Response } from "express";
import { addCommentService, getAllCommentsService, getCommentByIdService, updateCommentService } from "../services/comments.service";
import { z } from "zod";
import { getPostByIdService } from "../services/post.service";

export const getPostCommentsController = async (req:Request, res:Response) => {
    
    const schema = z.object({
        postId: z.number(),  
    })
    const schemaValidator = schema.safeParse({
        postId: parseInt(req.params.postId)
    })
    if(!schemaValidator.success) {
        res.status(400).json({message: 'Invalid data', errors: schemaValidator.error });
        return;
    }
    const {postId} = schemaValidator.data
    const post = await getPostByIdService(postId);
    if(!postId){
        res.status(400).json({message:"Post ID not found!"})
    }
    const comments = await getAllCommentsService(postId)
    res.json(comments)
}

export const addCommentController = async (req:Request, res:Response) => {
     // Using zod to validate the data coming from forms
     const schema = z.object({
        userId: z.number(),
        postId: z.number(),
        content:z.string(),
    })
    const schemaValidator = schema.safeParse(req.body)
    if(!schemaValidator.success) {
        res.status(400).json({message: 'Invalid data', errors: schemaValidator.error });
        return;
    }

    const {userId,postId,content} = req.body;
    const postIdExists = getPostByIdService(postId)
    if(!postIdExists){
        res.status(400).json({message:"Post ID not found!"})
    }
    const commentCreated = await addCommentService(userId,postId,content);
    res.json(commentCreated);
}

export const updateCommentController = async (req:Request, res:Response) => {
     // Using zod to validate the data coming from forms
     const schema = z.object({
        id:z.number(),
        userId: z.number(),
        postId: z.number(),
        content:z.string(),
    })
    const schemaValidator = schema.safeParse(req.body)
    if(!schemaValidator.success) {
        res.status(400).json({message: 'Invalid data', errors: schemaValidator.error });
        return;
    }

    const {id,userId,postId,content} = req.body;

    // Verify if the comment exists
    const commentExists = await getCommentByIdService(id)
    if(!commentExists){
        res.status(400).json({message:"Comment ID not found!"})
        return
    }
    // Verify if the post exists
    const postIdExists = await getPostByIdService(postId)
    if(!postIdExists || postId !== commentExists?.postId){
        res.status(400).json({message:"Post ID not found!"})
        return
    }

    // Verify if the userId is authorized to edit the comment
    if(userId !== commentExists?.userId){
        res.status(400).json({message:"User ID is not authorized to edit this comment!"})
        return
    }  

    const upadtedComment = await updateCommentService(id, content)
    res.json(upadtedComment)

}

export const deleteCommentController = async (req:Request, res:Response) => {

}