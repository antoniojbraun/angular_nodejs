import { Router } from "express";
import { getPostsController,addPostController,updatePostController,deletePostController } from "../controllers/post.controller";
import { authenticateJWT } from "../shared/auth.util";



const router = Router();

router.get('/',getPostsController);
router.post('/',authenticateJWT,addPostController);
router.put('/',authenticateJWT,updatePostController);
router.delete('/',authenticateJWT, deletePostController);

 export default router;