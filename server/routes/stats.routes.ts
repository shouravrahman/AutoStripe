import { Router } from "express";
import { getStats } from "../controllers/stats.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.use(isAuthenticated);
router.get("/", getStats);

export default router;
