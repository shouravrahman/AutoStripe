import { Router } from "express";
import { getStoresForApiKey } from "../controllers/lemonsqueezy.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.use(isAuthenticated);
router.post("/stores", getStoresForApiKey);

export default router;
