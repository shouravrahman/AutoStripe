import {
	lemonSqueezySetup,
	createCheckout,
} from "@lemonsqueezy/lemonsqueezy.js";
import { storage } from "../storage";

class BillingService {
	private storeId: string;
	private variantIds: { [key: string]: string };

	constructor() {
		if (!process.env.LEMONSQUEEZY_API_KEY) {
			throw new Error(
				"LEMONSQUEEZY_API_KEY is not configured for internal billing."
			);
		}
		if (!process.env.LEMONSQUEEZY_STORE_ID) {
			throw new Error(
				"LEMONSQUEEZY_STORE_ID is not configured for internal billing."
			);
		}
		// TODO: Add environment variables for all pricing plan variant IDs
		if (!process.env.LEMONSQUEEZY_PRO_VARIANT_ID) {
			throw new Error(
				"LEMONSQUEEZY_PRO_VARIANT_ID is not configured for internal billing."
			);
		}

		lemonSqueezySetup({
			apiKey: process.env.LEMONSQUEEZY_API_KEY,
		});

		this.storeId = process.env.LEMONSQUEEZY_STORE_ID;
		this.variantIds = {
			// Map your internal plan names to Lemon Squeezy Variant IDs
			// TODO: Ensure these environment variables are set
			free: process.env.LEMONSQUEEZY_FREE_VARIANT_ID || "", // Assuming a free plan might have a variant for tracking
			pro: process.env.LEMONSQUEEZY_PRO_VARIANT_ID,
			// team: process.env.LEMONSQUEEZY_TEAM_VARIANT_ID, // Example for another plan
		};
	}

	async getUpgradeUrl(userId: string, plan: string) {
		const user = await storage.getUser(userId);
		if (!user) {
			throw new Error("User not found");
		}

		const variantId = this.variantIds[plan];
		if (!variantId) {
			throw new Error(`Invalid plan specified: ${plan}`);
		}

		const checkout = await createCheckout(this.storeId, variantId, {
			checkoutData: {
				email: user.email,
				name: user.name,
				custom: {
					user_id: userId,
					plan_name: plan, // Pass plan name for webhook to pick up
				},
			},
		});

		if (!checkout.data) {
			throw new Error("Failed to create checkout session.");
		}

		return checkout.data.data.attributes.url;
	}
}

export const billingService = new BillingService();