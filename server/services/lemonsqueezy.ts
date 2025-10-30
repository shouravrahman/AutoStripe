import { decryptApiKey } from "../encryption";
import {
  lemonSqueezySetup,
  createCheckout,
  createProduct as createLsProduct,
  createVariant as createLsVariant,
  createWebhook as createLsWebhook,
  getStores as getLsStores,
  type LemonSqueezyOptions,
} from "@lemonsqueezy/lemonsqueezy.js";

// Define the UserCredential type locally
interface UserCredential {
  encryptedApiKey: string;
}

class LemonSqueezyService {
  private setup(credential: UserCredential) {
    const apiKey = decryptApiKey(credential.encryptedApiKey);
    const options: LemonSqueezyOptions = {
      apiKey,
      onError: (error) => {
        console.error("LemonSqueezy API Error:", error);
        throw new Error(`LemonSqueezy API error: ${error.message}`);
      },
    };
    lemonSqueezySetup(options);
  }

  async getStores(credential: UserCredential) {
    this.setup(credential);
    return await getLsStores();
  }

  async createProduct(
    credential: UserCredential,
    storeId: number,
    name: string,
    description: string
  ) {
    this.setup(credential);
    return await createLsProduct({
      name,
      description,
      storeId,
    });
  }

  async createVariant(
    credential: UserCredential,
    productId: number,
    name: string,
    price: number,
    interval: "month" | "year" | null,
    trialDays?: number
  ) {
    this.setup(credential);
    return await createLsVariant({
      name,
      price,
      productId,
      interval: interval ?? "day",
      intervalCount: 1,
      trialInterval: trialDays ? "day" : undefined,
      trialIntervalCount: trialDays || undefined,
    });
  }

  async getCheckoutUrl(credential: UserCredential, variantId: number) {
    this.setup(credential);
    const checkout = await createCheckout({
      variantId,
    });
    return checkout.data?.attributes.url;
  }

  async createWebhook(
    credential: UserCredential,
    storeId: number,
    url: string,
    events: string[]
  ) {
    this.setup(credential);
    return await createLsWebhook({
      storeId,
      url,
      events,
    });
  }
}

export const lemonSqueezyService = new LemonSqueezyService();