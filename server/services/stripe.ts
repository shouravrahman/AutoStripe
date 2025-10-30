import Stripe from "stripe";
import { decryptApiKey } from "../encryption";

// Define the UserCredential type locally
interface UserCredential {
  encryptedApiKey: string;
}

export class StripeService {
  private getClient(credential: UserCredential): Stripe {
    const apiKey = decryptApiKey(credential.encryptedApiKey);
    return new Stripe(apiKey, { apiVersion: "2024-04-10" });
  }

  async createProduct(credential: UserCredential, name: string, description: string) {
    const stripe = this.getClient(credential);
    return await stripe.products.create({
      name,
      description,
    });
  }

  async createPrice(
    credential: UserCredential,
    productId: string,
    amount: number,
    currency: string,
    interval: "month" | "year" | null,
    trialDays?: number
  ) {
    const stripe = this.getClient(credential);
    
    const priceData: Stripe.PriceCreateParams = {
      product: productId,
      unit_amount: amount,
      currency,
    };

    if (interval) {
      priceData.recurring = {
        interval: interval as "month" | "year",
        trial_period_days: trialDays || undefined,
      };
    }

    return await stripe.prices.create(priceData);
  }

  async createCheckoutSession(credential: UserCredential, priceId: string, successUrl: string, cancelUrl: string) {
    const stripe = this.getClient(credential);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    return session.url;
  }

  async createWebhook(credential: UserCredential, url: string, events: string[]) {
    const stripe = this.getClient(credential);
    return await stripe.webhookEndpoints.create({
      url,
      enabled_events: events as any[],
    });
  }

  async getProduct(credential: UserCredential, productId: string) {
    const stripe = this.getClient(credential);
    return await stripe.products.retrieve(productId);
  }
}

export const stripeService = new StripeService();
