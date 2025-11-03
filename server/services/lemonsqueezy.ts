import {
	lemonSqueezySetup,
	createWebhook,
} from "@lemonsqueezy/lemonsqueezy.js";
import type { PriceData, ProductData } from "./stripe";
import crypto from "crypto";
import axios from "axios";

export class LemonSqueezyService {
    private apiKey: string;
    private storeId: string;
    private API_BASE_URL = "https://api.lemonsqueezy.com/v1";

    constructor(apiKey: string, storeId: string) {
        this.apiKey = apiKey;
        this.storeId = storeId;
        // Initialize the SDK for webhook creation, if needed
        lemonsqueezySetup({ apiKey });
    }

    async createProductAndVariants(
        productData: ProductData,
        pricingPlans: PriceData[]
    ) {
        const headers = {
            Accept: "application/vnd.api+json",
            "Content-Type": "application/vnd.api+json",
            Authorization: `Bearer ${this.apiKey}`,
        };

        // 1. Create the Product directly via API
        const productPayload = {
            data: {
                type: "products",
                attributes: {
                    name: productData.name,
                    description: productData.description,
                    redirect_url: process.env.BASE_URL || "https://example.com", // TODO: Make this configurable
                },
                relationships: {
                    store: {
                        data: {
                            type: "stores",
                            id: this.storeId,
                        },
                    },
                },
            },
        };

        const productResponse = await axios.post(
            `${this.API_BASE_URL}/products`,
            productPayload,
            { headers }
        );
        const lemonProduct = productResponse.data.data;

        // 2. Create Variants for the Product directly via API
        const variantPromises = pricingPlans.map(async (plan) => {
            const isSubscription = plan.interval !== "once";
            const variantPayload = {
                data: {
                    type: "variants",
                    attributes: {
                        name: plan.name,
                        price: plan.amount,
                        is_subscription: isSubscription,
                        interval: isSubscription ? plan.interval : null,
                        interval_count: isSubscription ? 1 : null,
                    },
                    relationships: {
                        product: {
                            data: {
                                type: "products",
                                id: lemonProduct.id,
                            },
                        },
                    },
                },
            };
            const response = await axios.post(
                `${this.API_BASE_URL}/variants`,
                variantPayload,
                {
                    headers,
                }
            );
            return response.data.data;
        });

        const lemonVariants = await Promise.all(variantPromises);

        return { lemonProduct, lemonVariants };
    }

    async createWebhook(
        webhookUrl: string,
        secret: string
    ) {
        // The SDK's createWebhook function already uses the setup apiKey
        const webhook = await createWebhook(this.storeId, {
            url: webhookUrl,
            secret,
            events: [
                "order_created",
                "order_refunded",
                "subscription_created",
                "subscription_updated",
                "subscription_cancelled",
                "subscription_resumed",
                "subscription_expired",
                "subscription_payment_success",
                "subscription_payment_failed",
            ],
        });

        return webhook;
    }
}

// Export an instance for direct usage if needed (e.g., for internal billing if it were Lemon Squeezy)
// export const lemonSqueezyService = new LemonSqueezyService(process.env.LEMONSQUEEZY_API_KEY!, process.env.LEMONSQUEEZY_STORE_ID!);