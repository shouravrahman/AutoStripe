
import { Router } from "express";
import {
  handleStripeWebhook,
  handleLemonSqueezyWebhook,
} from "../controllers/webhook.controller";

const router = Router();

router.post("/stripe", handleStripeWebhook);
router.post("/lemonsqueezy", handleLemonSqueezyWebhook);

export default router;
