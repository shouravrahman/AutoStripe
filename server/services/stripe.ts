import Stripe from "stripe";

export interface ProductData {
	name: string;
	description?: string;
}

export interface PriceData {
	name: string;
	amount: number;
	currency: string;
	interval: "month" | "year" | "once";
	trialDays?: number;
}

export class StripeService {
    private stripe: Stripe;

    constructor(apiKey: string) {
        this.stripe = new Stripe(apiKey, { apiVersion: "2024-06-20" });
    }

    async createProductAndPrices(
        productData: ProductData,
        pricingPlans: PriceData[]
    ) {
        // 1. Create the Product in Stripe
        const stripeProduct = await this.stripe.products.create({
            name: productData.name,
            description: productData.description,
        });

        // 2. Create a Price for each plan
        const stripePrices = await Promise.all(
            pricingPlans.map((plan) => {
                const priceData: Stripe.PriceCreateParams = {
                    product: stripeProduct.id,
                    unit_amount: plan.amount,
                    currency: plan.currency,
                };

                if (plan.interval !== "once") {
                    priceData.recurring = { interval: plan.interval };
                    if (plan.trialDays && plan.trialDays > 0) {
                        priceData.recurring.trial_period_days = plan.trialDays;
                    }
                }

                return this.stripe.prices.create(priceData);
            })
        );

        return { stripeProduct, stripePrices };
    }

    async createWebhook(
        webhookUrl: string,
        webhookSecret?: string // Optional, for updating existing if needed
    ) {
        const STRIPE_WEBHOOK_EVENTS: Stripe.WebhookEndpointCreateParams.EnabledEvent[] = [
            "checkout.session.completed",
            "invoice.payment_succeeded",
            "invoice.payment_failed",
            "customer.subscription.created",
            "customer.subscription.updated",
            "customer.subscription.deleted",
        ];

        try {
            const webhookEndpoint = await this.stripe.webhookEndpoints.create({
                url: webhookUrl,
                enabled_events: STRIPE_WEBHOOK_EVENTS,
                api_version: "2024-06-20",
            });
            return webhookEndpoint;
        } catch (error: any) {
            // If the webhook endpoint already exists for this URL, Stripe throws an error.
            // We can list existing webhooks and find the one with the matching URL.
            if (error.code === "resource_already_exists") {
                console.log("Webhook already exists, attempting to retrieve it.");
                const webhooks = await this.stripe.webhookEndpoints.list();
                const existingWebhook = webhooks.data.find(
                    (wh) => wh.url === webhookUrl
                );
                if (existingWebhook) {
                    return existingWebhook;
                }
            }
            // Re-throw if it's a different error or if we couldn't find the existing webhook
            throw error;
        }
    }
}

// Export an instance for direct usage if needed (e.g., for internal billing if it were Stripe)
// export const stripeService = new StripeService(process.env.STRIPE_SECRET_KEY!);