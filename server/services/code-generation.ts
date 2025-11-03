import { Document } from "mongoose";
import Product from "../models/product.model";
import PricingPlan from "../models/pricing-plan.model";

// Define a more specific type for a Plan, assuming it has been populated
type PopulatedPlan = Omit<InstanceType<typeof PricingPlan>, "product">;

interface IProduct extends Document {
	name: string;
	description: string;
	plans: PopulatedPlan[];
	userId: string;
	backendStack: string; // Add backendStack to the product interface
}

type GenerationOptions = {
	backendStack: "nextjs-api" | "nodejs-express";
	paymentProviders: ("stripe" | "lemonsqueezy")[];
};

export class CodeGenerationService {
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

		// Generate database  usage schema/model files
		generatedCode["models/usage.model.ts"] =
			this.generateUsageTrackingPrismaSchema();

		// Generate paywall/subscription-checking logic
		if (options.backendStack === "nextjs-api") {
			generatedCode["lib/subscription.ts"] =
				this.generateNextJsSubscriptionCheck(options.paymentProviders);
			generatedCode["app/api/usage/route.ts"] =
				this.generateUsageApiRoute();
			generatedCode["app/api/usage/report/cron"] =
				this.generateUsageReportingCronJob();
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

		// Generate UI Components
		if (options.backendStack === "nextjs-api") {
			// Assuming UI is only for Next.js for now
			generatedCode["components/billing/PricingPage.tsx"] =
				this.generatePricingPageJsx(product);
			generatedCode["components/billing/ManageBillingButton.tsx"] =
				this.generateManageBillingButtonJsx();
			generatedCode["components/billing/SubscriptionGate.tsx"] =
				this.generateSubscriptionGateJsx();
		}

		return generatedCode;
	}

	private generateEnvConfig(product: IProduct, providers: string[]): string {
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
	//
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

    // Fetch the user from your database to get their Stripe Customer ID
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

      // Save the new customer ID to your database
      await db.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      mode: "subscription", // or "payment" for one-time purchases
      line_items: [
        {
          price: planId, // This is the Stripe Price ID
          quantity: 1,
        },
      ],
      success_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/\${redirectUrl || "dashboard"}?session_id={CHECKOUT_SESSION_ID}\`,
      cancel_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/\${redirectUrl || "dashboard"}\`,
      metadata: {
        userId: session.user.id,
      },
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

	//
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
    return new NextResponse(\`Webhook Error: \${error.message}\`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Handle successful checkout
  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const userId = session?.metadata?.userId;
    if (!userId) {
      return new NextResponse(
        "Webhook Error: Missing user ID in session metadata",
        { status: 400 }
      );
    }

    await db.user.update({
      where: { id: userId },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeSubscriptionEndsAt: new Date(subscription.current_period_end * 1000),
        subscriptionStatus: "active",
        planId: subscription.items.data[0].price.id,
      },
    });
  }

  // Handle subscription renewal
  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await db.user.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeSubscriptionEndsAt: new Date(subscription.current_period_end * 1000),
        subscriptionStatus: "active",
      },
    });
  }

  // Handle cancellation or expiration
  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription;

    await db.user.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        subscriptionStatus: subscription.status,
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
        redirectUrl: \`\${process.env.NEXT_PUBLIC_APP_URL}/\${redirectUrl || 'dashboard'}\`,
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

	//
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

    // Only handle subscription events
    if (meta.event_name.startsWith("subscription_")) {
      const userId = meta.custom_data?.user_id;
      if (!userId) {
        return new NextResponse("Webhook Error: Missing user_id in custom_data", { status: 400 });
      }

      const subscription = data;
      const subscriptionId = subscription.id;

      // Update user record in your database
      await db.user.update({
        where: { id: userId },
        data: {
          lemonSqueezySubscriptionId: subscriptionId,
          lemonSqueezyVariantId: subscription.attributes.variant_id,
          subscriptionStatus: subscription.attributes.status, // e.g., "active", "cancelled", "expired"
          planId: subscription.attributes.variant_id, // Or map to your own plan IDs
          lemonSqueezySubscriptionEndsAt: subscription.attributes.ends_at
            ? new Date(subscription.attributes.ends_at)
            : null,
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

	private generatePricingPageJsx(product: IProduct): string {
		return `
// components/billing/PricingPage.tsx
// Install ShadCN UI components: npx shadcn-ui@latest add button card

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { apiRequest } from "@/lib/apiRequest";

interface PricingPlan {
  name: string;
  amount: number;
  currency: string;
  interval: "month" | "year" | "once";
  trialDays: number;
  features: string; // Comma-separated features
  stripePriceId?: string;
  lemonSqueezyVariantId?: string;
}

interface PricingPageProps {
  productName: string;
  productDescription: string;
  plans: PricingPlan[];
}

export default function PricingPage({ productName, productDescription, plans }: PricingPageProps) {
  const handleCheckout = async (provider: "stripe" | "lemonsqueezy", planId: string) => {
    try {
      let url = '';
      if (provider === "stripe") {
        const response = await apiRequest("POST", "/api/stripe/checkout", { planId, redirectUrl: "dashboard" });
        url = response.url;
      } else if (provider === "lemonsqueezy") {
        const response = await apiRequest("POST", "/api/lemonsqueezy/checkout", { variantId: planId, redirectUrl: "dashboard" });
        url = response.url;
      }
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Could not get checkout URL");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to initiate checkout. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">{productName}</h2>
        <p className="text-lg text-muted-foreground mt-2">{productDescription}</p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = (plan.amount / 100).toFixed(2);
          const interval = plan.interval === "once" ? "one-time" : plan.interval;
          const features = plan.features.split(',').map(f => f.trim());
          const ctaText = plan.amount === 0 ? "Get Started" : "Subscribe";

          return (
            <Card key={plan.name} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-center">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="grow">
                <p className="text-center">
                  <span className="text-5xl font-extrabold">${product}</span>
                  <span className="text-muted-foreground">/{interval}</span>
                </p>
                <ul className="mt-6 space-y-2">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.stripePriceId ? (
                  <Button className="w-full" onClick={() => handleCheckout("stripe", plan.stripePriceId!)}>
                    {ctaText}
                  </Button>
                ) : plan.lemonSqueezyVariantId ? (
                  <Button className="w-full" onClick={() => handleCheckout("lemonsqueezy", plan.lemonSqueezyVariantId!)}>
                    {ctaText}
                  </Button>
                ) : (
                  <Button className="w-full" disabled>No Checkout Configured</Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
`;
	}

	//
	private generateManageBillingButtonJsx(): string {
		return `
// components/billing/ManageBillingButton.tsx
// Install ShadCN UI components: npx shadcn-ui@latest add button

import React from 'react';
import { Button } from "../ui/button";

interface ManageBillingButtonProps {
  provider: "stripe" | "lemonsqueezy";
  customerId?: string; // Stripe or Lemon Squeezy Customer ID
  redirectUrl?: string; // Optional redirect URL after managing billing
}

export default function ManageBillingButton({
  provider,
  customerId,
  redirectUrl,
}: ManageBillingButtonProps) {

  const handleManageBilling = async () => {
    if (!customerId) {
      alert("Customer ID is missing. Unable to open billing portal.");
      return;
    }

    try {
      let portalUrl = "";

      if (provider === "stripe") {
        // TODO: Replace with your backend API call
        // Example:
        // const response = await fetch("/api/billing/stripe-portal", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ customerId }),
        // });
        // const data = await response.json();
        // portalUrl = data.url;

        alert("Stripe billing portal integration not implemented yet. Please set up a backend endpoint.");
      } else if (provider === "lemonsqueezy") {
        // TODO: Replace with Lemon Squeezy portal link or API
        alert("Lemon Squeezy billing portal integration not implemented yet. Please set up a backend endpoint.");
      }

      if (portalUrl) {
        window.location.href = portalUrl + (redirectUrl ? \`?redirect=\${redirectUrl}\` : "");
      }

    } catch (error) {
      console.error("[ManageBillingButton] Error opening billing portal:", error);
      alert("Failed to open billing portal. Please try again later.");
    }
  };

  return (
    <Button onClick={handleManageBilling} className="w-full">
      Manage Billing
    </Button>
  );
}
`;
	}

	//
	private generateSubscriptionGateJsx(): string {
		return `
// components/billing/SubscriptionGate.tsx
// Install ShadCN UI components: npx shadcn-ui@latest add button

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button"; // Adjust path
import { hasActiveSubscription, hasPlan } from "@/lib/subscription";

interface SubscriptionGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode; // Shown if user lacks access
  requiredPlanId?: string | string[]; // Specific plan(s) required
  requireActive?: boolean; // Require any active subscription (default: true)
  redirectUrl?: string; // Optional redirect if no access
}

export default function SubscriptionGate({
  children,
  fallback = (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-lg">
      <h3 className="text-xl font-semibold">Upgrade Required</h3>
      <p className="text-muted-foreground mt-2">
        You need an active subscription or a higher plan to access this feature.
      </p>
      <Button className="mt-4">Upgrade Now</Button>
    </div>
  ),
  requiredPlanId,
  requireActive = true,
  redirectUrl,
}: SubscriptionGateProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      setLoading(true);
      let authorized = false;

      if (requiredPlanId) {
        authorized = await hasPlan(requiredPlanId);
      } else if (requireActive) {
        authorized = await hasActiveSubscription();
      }

      setHasAccess(authorized);
      setLoading(false);
    }
    checkAccess();
  }, [requiredPlanId, requireActive]);

  // Optional redirect
  useEffect(() => {
    if (!loading && !hasAccess && redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [loading, hasAccess, redirectUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></span>
        <span className="ml-2 text-muted-foreground">Checking subscription...</span>
      </div>
    );
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
`;
	}

	private generateNextJsSubscriptionCheck(providers: string[]): string {
		return `
// lib/subscription.ts
import { auth } from "@/auth"; // Replace with your auth provider
import { db } from "@/db";     // Replace with your database client

/**
 * Checks if the currently logged-in user has any active subscription.
 * Works for Stripe, Lemon Squeezy, or any other provider you integrate.
 */
export async function hasActiveSubscription(): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return false;

  // Active statuses could be "active", "on_trial", or any custom status
  return ["active", "on_trial"].includes(user.subscriptionStatus || "");
}

/**
 * Checks if the currently logged-in user has a specific plan or plans.
 * @param requiredPlan A single plan ID or an array of plan IDs.
 */
export async function hasPlan(requiredPlan: string | string[]): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.planId) return false;

  const plans = Array.isArray(requiredPlan) ? requiredPlan : [requiredPlan];
  return plans.includes(user.planId);
}

/* Example usage in a Server Component or API Route:
import { hasActiveSubscription, hasPlan } from "@/lib/subscription";

export default async function ProtectedPage() {
  const isSubscribed = await hasActiveSubscription();
  const hasProPlan = await hasPlan("pro_plan_id");

  if (!isSubscribed) {
    // Redirect to pricing page or show upgrade message
  }

  // Render page content
}
*/
`;
	}
	private generateUsageTrackingPrismaSchema(): string {
		return `
// prisma/schema.prisma
// Extend your existing Prisma schema with these models for usage tracking.

model UsageRecord {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  featureId String
  quantity  Int
  timestamp DateTime @default(now())

  @@index([userId])
  @@index([featureId])
}

model FeatureMeter {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  featureId String   @unique
  stripeMeteredFeatureId String? // If using Stripe Billing Metered Features
  unitName  String // e.g., "API Calls", "GB", "Seats"
  // Add other metadata as needed
}
`;
	}

	private generateUsageApiRoute(): string {
		return `
// app/api/usage/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth"; // TODO: Replace with your actual auth provider
import { db } from "@/db";     // TODO: Replace with your actual database client

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { featureId, quantity } = await req.json();

    if (!featureId || typeof quantity !== 'number' || quantity <= 0) {
      return new NextResponse("Invalid featureId or quantity", { status: 400 });
    }

    // Record usage in your database
    await db.usageRecord.create({
      data: {
        userId: session.user.id,
        featureId,
        quantity,
      },
    });

    return new NextResponse("Usage recorded", { status: 200 });

  } catch (error) {
    console.error("[USAGE_API_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
`;
	}

	private generateUsageReportingCronJob(): string {
		return `
// app/api/cron/report-usage/route.ts
// Scheduled serverless function (Vercel Cron, AWS Lambda, etc.)
// Aggregates usage and reports to Stripe metered billing.

import { NextResponse } from "next/server";
import { db } from "@/db";        // Replace with your database client
import { stripe } from "@/lib/stripe"; // Initialize Stripe client

export async function GET(req: Request) {
  // Secure this endpoint (check for cron secret)
  if (req.headers.get('Authorization') !== \`Bearer \${process.env.CRON_SECRET}\`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  try {
    // Fetch users with active Stripe subscriptions
    const users = await db.user.findMany({
      where: {
        stripeSubscriptionId: { not: null },
        subscriptionStatus: "active",
      },
    });

    for (const user of users) {
      // Fetch usage records in the last 24 hours
      const usageRecords = await db.usageRecord.findMany({
        where: {
          userId: user.id,
          timestamp: { gte: twentyFourHoursAgo, lte: now },
        },
      });

      // Aggregate usage per feature
      const aggregated: { [featureId: string]: number } = {};
      for (const record of usageRecords) {
        aggregated[record.featureId] = (aggregated[record.featureId] || 0) + record.quantity;
      }

      // Report usage to Stripe for each feature
      for (const featureId in aggregated) {
        const totalQuantity = aggregated[featureId];

        // TODO: Retrieve the correct Stripe subscription item ID for this feature
        // e.g., const subscriptionItemId = await getSubscriptionItemId(user.stripeSubscriptionId, featureId);
        const subscriptionItemId = featureId;

        if (subscriptionItemId) {
          await stripe.subscriptionItems.createUsageRecord(
            subscriptionItemId,
            {
              quantity: totalQuantity,
              timestamp: Math.floor(now.getTime() / 1000),
              action: "increment", // Ensures usage is added to existing quantity
            }
          );
        }
      }
    }

    // Optional: Clear processed usage records
    // await db.usageRecord.deleteMany({ where: { timestamp: { lte: now } } });

    return new NextResponse("Usage reported successfully", { status: 200 });

  } catch (error) {
    console.error("[USAGE_REPORTING_CRON_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
`;
	}
}
