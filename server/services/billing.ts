import { lemonSqueezyService } from "./lemonsqueezy";
import { storage } from "../storage";

class BillingService {
  async getUpgradeUrl(userId: string, plan: "pro" | "team") {
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const variantId = process.env.LEMONSQUEEZY_PRO_VARIANT_ID;
    if (!variantId) {
      throw new Error("Pro-plan-variant-ID not configured");
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;

    if (!apiKey || !storeId) {
      throw new Error("LemonSqueezy API key or store ID not configured");
    }

    // @ts-ignore
    const checkout = await lemonSqueezyService.createCheckout(
      apiKey,
      storeId,
      variantId,
      {
        email: user.email,
        name: user.name,
        custom: {
          user_id: userId,
        },
      }
    );

    return checkout.data.attributes.url;
  }
}

export const billingService = new BillingService();
