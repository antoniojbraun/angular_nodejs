import { Router } from "express";
import {
  addCategoryController,
  deleteCategoryController,
  getCategoriesController,
  getCategoryBySlugController,
  updateCategoryController,
} from "../controllers/category.controller";
import { authenticateJWT } from "../shared/auth.util";

const router = Router();

router.get("/", getCategoriesController);
router.post("/", authenticateJWT, addCategoryController);
router.put("/", authenticateJWT, updateCategoryController);
router.delete("/", authenticateJWT, deleteCategoryController);
router.get("/slug/:slug", getCategoryBySlugController);

export default router;
