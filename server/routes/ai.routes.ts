import { Router } from "express";
import { getSuggestions } from "../controllers/ai.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.use(isAuthenticated);
router.post("/suggest", getSuggestions);

export default router;