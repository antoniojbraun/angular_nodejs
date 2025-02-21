import { Router } from "express";
import { addTagController, deleteTagController, getPostTagsController, getTagBySlugController, getTagsController, updateTagController } from "../controllers/tag.controller";
import { authenticateJWT } from "../shared/auth.util";
import { getTagBySlugService } from "../services/tag.service";


const router = Router();

router.get('/',getTagsController);
router.post('/',authenticateJWT,addTagController);
router.put('/',authenticateJWT,updateTagController);
router.delete('/', authenticateJWT, deleteTagController);
router.get('/getposttagrelation/:postId', getPostTagsController);
router.get('/gettagbyslug/:slug', getTagBySlugController)

 export default router;