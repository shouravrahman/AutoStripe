import { Router } from "express";
import { getSuggestions, generateCode } from "../controllers/ai.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.use(isAuthenticated);
router.post("/suggest", getSuggestions);
router.post("/generate-code", generateCode);

export default router;
