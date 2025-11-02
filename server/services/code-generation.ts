import Product from "../models/product.model";
import PricingPlan from "../models/pricing-plan.model";

// Define a more specific type for a Plan, assuming it has been populated
type PopulatedPlan = Omit<InstanceType<typeof PricingPlan>, "product">;

interface IProduct extends Document {
	name: string;
	description: string;
	plans: PopulatedPlan[];
	userId: string;
}

type GenerationOptions = {
	backendStack: "nextjs-api" | "nodejs-express";
	paymentProviders: ("stripe" | "lemonsqueezy")[];
};

class CodeGenerationService {
	/**
	 * Main function to generate all necessary code files.
	 */
	public generateCode(
		product: IProduct,
		options: GenerationOptions
	): Record<string, string> {
		const generatedCode: Record<string, string> = {};

		// Generate environment configuration
		generatedCode[".env.example"] = this.generateEnvConfig(
			product,
			options.paymentProviders
		);

		// Generate paywall/subscription-checking logic
		if (options.backendStack === "nextjs-api") {
			generatedCode["lib/subscription.ts"] =
				this.generateNextJsSubscriptionCheck(options.paymentProviders);
		}

		// Generate code for each payment provider
		if (options.paymentProviders.includes("stripe")) {
			if (options.backendStack === "nextjs-api") {
				generatedCode["app/api/stripe/checkout/route.ts"] =
					this.generateStripeCheckoutNextJs(product);
				generatedCode["app/api/stripe/webhook/route.ts"] =
					this.generateStripeWebhookNextJs();
			}
		}

		if (options.paymentProviders.includes("lemonsqueezy")) {
			if (options.backendStack === "nextjs-api") {
				generatedCode["app/api/lemonsqueezy/checkout/route.ts"] =
					this.generateLemonSqueezyCheckoutNextJs(product);
				generatedCode["app/api/lemonsqueezy/webhook/route.ts"] =
					this.generateLemonSqueezyWebhookNextJs();
			}
		}

		return generatedCode;
	}

	private generateEnvConfig(
		product: IProduct,
		providers: string[]
	): string {
		let config = `# Required Environment Variables for ${product.name}\n\n`;
		config += `# General App Settings\n`;
		config += `NEXT_PUBLIC_APP_URL=http://localhost:3000\n\n`;

		if (providers.includes("stripe")) {
			config += `# Stripe Configuration\n`;
			config += `STRIPE_SECRET_KEY=sk_test_...\n`;
			config += `STRIPE_WEBHOOK_SECRET=whsec_...\n\n`;
		}

		if (providers.includes("lemonsqueezy")) {
			config += `# Lemon Squeezy Configuration\n`;
			config += `LEMONSQUEEZY_API_KEY=...\n`;
			config += `LEMONSQUEEZY_STORE_ID=...\n`;
			config += `LEMONSQUEEZY_WEBHOOK_SECRET=...\n\n`;
		}

		config += `# Add your database, auth, etc. variables here\n`;
		return config;
	}

	private generateNextJsSubscriptionCheck(providers: string[]): string {
		return `
import { auth } from "@/auth"; // TODO: Replace with your actual auth provider
import { db } from "@/db";     // TODO: Replace with your actual database client

// This is a simplified example. You will need to adapt this to your database schema.
// We assume you have a 'user' table with fields like 'stripeSubscriptionId',
// 'lemonSqueezySubscriptionId', 'planId', and 'subscriptionStatus'.

export async function hasActiveSubscription() {
  const session = await auth();
  if (!session?.user?.id) {
    return false;
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return false;
  }

  // Check for an active status in your database.
  // This status should be updated by your webhook handlers.
  return user.subscriptionStatus === "active" || user.subscriptionStatus === "on_trial";
}

/**
 * Checks if the user has a subscription to a specific plan or plans.
 * @param {string | string[]} requiredPlan - The plan ID or an array of plan IDs to check against.
 */
export async function hasPlan(requiredPlan: string | string[]) {
    const session = await auth();
    if (!session?.user?.id) {
        return false;
    }

    const user = await db.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user || !user.planId) {
        return false;
    }

    const plans = Array.isArray(requiredPlan) ? requiredPlan : [requiredPlan];
    return plans.includes(user.planId);
}

// Example usage in a Server Component or Route Handler:
/*
import { hasActiveSubscription, hasPlan } from "@/lib/subscription";

export default async function ProtectedPage() {
  const isSubscribed = await hasActiveSubscription();
  const hasProPlan = await hasPlan("pro_plan_id"); // TODO: Replace with your actual plan ID

  if (!isSubscribed) {
    // Redirect to pricing page or show an upgrade message
  }

  // Render page content
}
*/
`;
	}

	private generateStripeCheckoutNextJs(product: IProduct): string {
		return `
import { NextResponse } from "next/server";
import { auth } from "@/auth"; // TODO: Replace with your actual auth provider
import { stripe } from "@/lib/stripe"; // TODO: Initialize Stripe client in this file
import { db } from "@/db"; // TODO: Replace with your actual database client

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { planId, redirectUrl } = await req.json();
    
    if (!planId) {
        return new NextResponse("Plan ID is required", { status: 400 });
    }

    // TODO: Fetch the user from your database to get their Stripe Customer ID
    const user = await db.user.findUnique({
        where: { id: session.user.id },
    });

    let stripeCustomerId = user?.stripeCustomerId;

    // If the user doesn't have a Stripe Customer ID, create one
    if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
            email: session.user.email!,
            name: session.user.name || undefined,
        });
        stripeCustomerId = customer.id;

        // TODO: Save the new customer ID to your database
        await db.user.update({
            where: { id: session.user.id },
            data: { stripeCustomerId },
        });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      mode: "subscription", // or "payment" for one-time purchases
      line_items: [{
        price: planId, // This is the Stripe Price ID
        quantity: 1,
      }],
      success_url: `
${process.env.NEXT_PUBLIC_APP_URL}/
${redirectUrl || 'dashboard'}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `
${process.env.NEXT_PUBLIC_APP_URL}/
${redirectUrl || 'dashboard'}`,
      metadata: {
        userId: session.user.id,
      }
    });

    if (!checkoutSession.url) {
      return new NextResponse("Error creating checkout session", { status: 500 });
    }

    return NextResponse.json({ url: checkoutSession.url });

  } catch (error) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
`;
	}

	private generateStripeWebhookNextJs(): string {
		return `
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe"; // TODO: Initialize Stripe client
import { db } from "@/db"; // TODO: Replace with your actual database client

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`,
      { status: 400 }
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Handle successful checkout
  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    
    const userId = session?.metadata?.userId;
    if (!userId) {
      return new NextResponse("Webhook Error: Missing user ID in session metadata", { status: 400 });
    }

    // TODO: Update user record in your database
    await db.user.update({
      where: { id: userId },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeSubscriptionEndsAt: new Date(subscription.current_period_end * 1000),
        subscriptionStatus: "active",
        planId: subscription.items.data[0].price.id, // Or a custom plan ID
      },
    });
  }

  // Handle subscription renewal
  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    // TODO: Update user's subscription period in your database
     await db.user.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeSubscriptionEndsAt: new Date(subscription.current_period_end * 1000),
        subscriptionStatus: "active",
      },
    });
  }

    // Handle subscription cancellation or expiration
    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as Stripe.Subscription;
        // TODO: Update user's subscription status in your database
        await db.user.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
                subscriptionStatus: subscription.status, // e.g., 'canceled', 'past_due'
            },
        });
    }

  return new NextResponse(null, { status: 200 });
}
`;
	}

	private generateLemonSqueezyCheckoutNextJs(product: IProduct): string {
		return `
import { NextResponse } from "next/server";
import { auth } from "@/auth"; // TODO: Replace with your actual auth provider
import { lemonSqueezy } from "@/lib/lemonsqueezy"; // TODO: Initialize Lemon Squeezy client

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id || !session.user.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { variantId, redirectUrl } = await req.json();

        if (!variantId) {
            return new NextResponse("Variant ID is required", { status: 400 });
        }

        const checkout = await lemonSqueezy.createCheckout({
          storeId: process.env.LEMONSQUEEZY_STORE_ID!,
          variantId,
          checkoutData: {
            email: session.user.email,
            custom: {
                user_id: session.user.id,
            },
          },
          productOptions: {
            redirectUrl: `
${process.env.NEXT_PUBLIC_APP_URL}/
${redirectUrl || 'dashboard'}`,
          },
        });

        if (!checkout.url) {
            return new NextResponse("Error creating checkout session", { status: 500 });
        }

        return NextResponse.json({ url: checkout.url });

    } catch (error) {
        console.error("[LEMONSQUEEZY_CHECKOUT_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
`;
	}

	private generateLemonSqueezyWebhookNextJs(): string {
		return `
import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db"; // TODO: Replace with your actual database client

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;

        const hmac = crypto.createHmac("sha256", secret);
        const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
        const signature = Buffer.from(req.headers.get("X-Signature") || "", "utf8");

        if (!crypto.timingSafeEqual(digest, signature)) {
            return new NextResponse("Invalid signature", { status: 400 });
        }

        const payload = JSON.parse(rawBody);
        const { meta, data } = payload;

        // Ensure it's a subscription event
        if (meta.event_name.startsWith("subscription_")) {
            const userId = meta.custom_data?.user_id;
            if (!userId) {
                return new NextResponse("Webhook Error: Missing user_id in custom_data", { status: 400 });
            }

            const subscription = data;
            const subscriptionId = subscription.id;
            
            // TODO: Update user record in your database
            await db.user.update({
                where: { id: userId },
                data: {
                    lemonSqueezySubscriptionId: subscriptionId,
                    lemonSqueezyVariantId: subscription.attributes.variant_id,
                    subscriptionStatus: subscription.attributes.status, // e.g., "active", "cancelled", "expired"
                    planId: subscription.attributes.variant_id, // Or a custom plan ID
                    lemonSqueezySubscriptionEndsAt: subscription.attributes.ends_at ? new Date(subscription.attributes.ends_at) : null,
                },
            });
        }

        return new NextResponse(null, { status: 200 });

    } catch (error) {
        console.error("[LEMONSQUEEZY_WEBHOOK_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
`;
	}
}

export const codeGenerationService = new CodeGenerationService();