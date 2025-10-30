import { Router } from "express";
import { extractProductInfo } from "../controllers/scraper.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.post("/extract", isAuthenticated, extractProductInfo);

export default router;
