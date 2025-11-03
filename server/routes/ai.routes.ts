import { Router } from "express";
import { getSuggestions, generateCode, previewCode, downloadCode } from "../controllers/ai.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.use(isAuthenticated);
router.post("/suggest", getSuggestions);
router.post("/generate-code", generateCode);
router.post("/preview-code", previewCode);
router.get("/download-code", downloadCode);

export default router;
