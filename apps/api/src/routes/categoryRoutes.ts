import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  getMoviesByCategorySlug,
} from "../controllers/categoryController";

const router = Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.get("/:slug/movies", getMoviesByCategorySlug);

export default router;
