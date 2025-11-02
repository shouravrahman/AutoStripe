import { Router } from "express";
import { generateProduct, getProducts } from "../controllers/product.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.use(isAuthenticated);
router.get("/", getProducts);
router.post("/generate", generateProduct);

export default router;
