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

    switch (event_name) {
      case "subscription_created":
      case "subscription_updated":
        const subscriptionId: string | null = data.id || null;
        await storage.updateUserSubscription(
          userId,
          data.attributes.status,
          subscriptionId
        );
        break;
      case "subscription_cancelled":
        await storage.updateUserSubscription(userId, "free", null);
        break;
    }

    res.sendStatus(200);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
