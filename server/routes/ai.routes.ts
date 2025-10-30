import { Router } from "express";
import { suggestDescription, suggestPricingTiers, getGeneratedCode } from "../controllers/ai.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.post("/suggest-description", isAuthenticated, suggestDescription);
router.post("/suggest-pricing-tiers", isAuthenticated, suggestPricingTiers);
router.post("/generate-code", isAuthenticated, getGeneratedCode);

export default router;