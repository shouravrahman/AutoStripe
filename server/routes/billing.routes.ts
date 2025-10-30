import { Router } from "express";
import { upgrade, webhook } from "../controllers/billing.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.post("/upgrade", isAuthenticated, upgrade);
router.post("/webhook", webhook);

export default router;
