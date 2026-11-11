import { Router } from "express";
import {
  getAllMovies,
  getMovieById,
  getMovieBySlug,
} from "../controllers/movieController";

const router = Router();

router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.get("/:slug/movie", getMovieBySlug);

export default router;
