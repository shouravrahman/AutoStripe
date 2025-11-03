import { Request, Response } from "express";
import { storage } from "../storage";
import { billingService } from "../services/billing";

export const upgrade = async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const { plan } = req.body;
    const upgradeUrl = await billingService.getUpgradeUrl(userId, plan);

    res.json({ upgradeUrl });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const webhook = async (req: Request, res: Response) => {
  try {
    const { event_name, data } = req.body;
    const userId = data.attributes.custom_data.user_id;

    let subscriptionTier: string = "free"; // Default to free

    // TODO: Extract the actual tier from the webhook data. This depends on how you map Lemon Squeezy variants to your internal tiers.
    // For example, if data.attributes.variant_id corresponds to a specific tier.
    // Placeholder logic:
    if (data.attributes.variant_id === process.env.LEMONSQUEEZY_PRO_VARIANT_ID) {
        subscriptionTier = "pro";
    } else if (data.attributes.variant_id === process.env.LEMONSQUEEZY_FREE_VARIANT_ID) {
        subscriptionTier = "free";
    }

    switch (event_name) {
      case "subscription_created":
      case "subscription_updated":
        const subscriptionId: string | null = data.id || null;
        await storage.updateUserSubscription(
          userId,
          data.attributes.status,
          subscriptionId,
          subscriptionTier // Pass the tier
        );
        break;
      case "subscription_cancelled":
        await storage.updateUserSubscription(userId, "cancelled", null, "free"); // Revert to free tier on cancellation
        break;
      case "order_created": // Handle one-time purchases if applicable
        // TODO: Implement logic for one-time purchases if they grant a specific tier/feature
        break;
    }

    res.sendStatus(200);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};