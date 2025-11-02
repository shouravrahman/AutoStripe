import {
	lemonSqueezySetup,
	createCheckout,
} from "@lemonsqueezy/lemonsqueezy.js";
import { storage } from "../storage";

class BillingService {
	private storeId: string;
	private proVariantId: string;

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
		if (!process.env.LEMONSQUEEZY_PRO_VARIANT_ID) {
			throw new Error(
				"LEMONSQUEEZY_PRO_VARIANT_ID is not configured for internal billing."
			);
		}

		lemonSqueezySetup({
			apiKey: process.env.LEMONSQUEEZY_API_KEY,
		});

		this.storeId = process.env.LEMONSQUEEZY_STORE_ID;
		this.proVariantId = process.env.LEMONSQUEEZY_PRO_VARIANT_ID;
	}

	async getUpgradeUrl(userId: string, plan: "pro" | "team") {
		const user = await storage.getUser(userId);
		if (!user) {
			throw new Error("User not found");
		}

		// The plan logic can be expanded here if you add a "team" plan later
		if (plan !== "pro") {
			throw new Error("Invalid plan specified");
		}

		const checkout = await createCheckout(this.storeId, this.proVariantId, {
			checkoutData: {
				email: user.email,
				name: user.name,
				custom: {
					user_id: userId,
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
