import { Router } from "express";
import { extractFromUrl } from "../controllers/scrape.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.use(isAuthenticated);
router.post("/extract", extractFromUrl);

export default router;
