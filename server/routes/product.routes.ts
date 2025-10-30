import { Router } from "express";
import {
  getProducts,
  getProductById,
  generateProduct,
} from "../controllers/product.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.use(isAuthenticated);

router.get("/", getProducts);
router.post("/generate", generateProduct);
router.get("/:id", getProductById);

export default router;
