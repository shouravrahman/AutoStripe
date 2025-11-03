import { Router } from "express";
import { generateProduct, getProducts, generateCode, previewCode, downloadCode } from "../controllers/product.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.use(isAuthenticated);
router.get("/", getProducts);
router.post("/generate", generateProduct);
router.post("/generate-code", generateCode);
router.post("/preview-code", previewCode);
router.get("/download-code", downloadCode);

export default router;