import { Router } from "express";
import { getStats, logUsage } from "../controllers/stats.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

// Authenticated routes
router.use(isAuthenticated);
router.get("/", getStats);
router.post("/usage", logUsage);

export default router;
