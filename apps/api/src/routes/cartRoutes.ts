import { Router } from "express";
import {
  addToCart,
  getCart,
  removeCart,
  removeFromCart,
} from "../controllers/cartController";

const router = Router();

router.post("/", addToCart);
router.get("/:cartId", getCart);
router.delete("/:cartId", removeCart);
router.delete("/:cartId/:movieId", removeFromCart);

export default router;
