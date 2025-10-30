import { Request, Response } from "express";
import { storage } from "../storage";
import { stripeService } from "../services/stripe";
import { lemonSqueezyService } from "services/lemonsqueezy";
import { codeGenerationService } from "../services/code-generation";

export const getProducts = async (req: Request, res: Response) => {
	const userId = req.session?.userId;
	if (!userId) return res.status(401).json({ message: "Not authenticated" });

	const products = await storage.getUserProducts(userId);
	res.json(products);
};

export const getProductById = async (req: Request, res: Response) => {
	const userId = req.session?.userId;
	if (!userId) return res.status(401).json({ message: "Not authenticated" });

	const product = await storage.getProductById(req.params.id);
	if (!product || product.userId !== userId) {
		return res.status(404).json({ message: "Product not found" });
	}

	const pricingPlans = await storage.getProductPricingPlans(product.id);
	const webhooks = await storage.getProductWebhooks(product.id);
	const configs = await storage.getProductConfigs(product.id);

	res.json({ ...product, pricingPlans, webhooks, configs });
};

export const generateProduct = async (req: Request, res: Response) => {
	try {
		const userId = req.session?.userId;
		if (!userId)
			return res.status(401).json({ message: "Not authenticated" });

		const { projectId, product, pricingPlans, integrationSettings } =
			req.body;

		// Verify project ownership
		const project = await storage.getProjectById(projectId);
		if (!project || project.userId !== userId) {
			return res.status(404).json({ message: "Project not found" });
		}

		// Check subscription status and product limits
		const user = await storage.getUser(userId);
		const userProducts = await storage.getUserProducts(userId);

		if (user?.subscriptionStatus === "free" && userProducts.length >= 3) {
			return res.status(403).json({
				message:
					"Free plan limit reached. Upgrade to Pro for unlimited products.",
			});
		}

		// Create product record
		const createdProduct = await storage.createProduct(userId, projectId, {
			name: product.name,
			description: product.description,
		});

		// Get user credentials
		const credentials = await storage.getUserCredentials(userId);
		const stripeCredential = credentials.find(
			(c) => c.provider === "stripe" && c.isActive
		);
		const lemonCredential = credentials.find(
			(c) => c.provider === "lemonsqueezy" && c.isActive
		);

		// Generate in Stripe (using USER'S API keys)
		if (integrationSettings.createInStripe && stripeCredential) {
			const stripeProduct = await stripeService.createProduct(
				stripeCredential,
				product.name,
				product.description
			);

			await storage.updateProduct(createdProduct.id, {
				stripeProductId: stripeProduct.id,
				stripeCredentialId: stripeCredential.id,
			});

			// Create pricing plans in Stripe
			for (const plan of pricingPlans) {
				const stripePrice = await stripeService.createPrice(
					stripeCredential,
					stripeProduct.id,
					plan.amount,
					plan.currency,
					(plan.interval === "once" ? null : plan.interval) as
						| "month"
						| "year"
						| null,
					plan.trialDays
				);

				const checkoutUrl = await stripeService.createCheckoutSession(
					stripeCredential,
					stripePrice.id,
					`${process.env.BASE_URL}/success`,
					`${process.env.BASE_URL}/cancel`
				);

				await storage.createPricingPlan(createdProduct.id, {
					...plan,
					stripePriceId: stripePrice.id,
					checkoutUrl,
				});
			}

			// Setup webhook if requested
			if (integrationSettings.setupWebhooks) {
				const webhookUrl = `${
					process.env.BASE_URL || "https://autobill.app"
				}/api/webhooks/stripe`;
				const webhook = await stripeService.createWebhook(
					stripeCredential,
					webhookUrl,
					[
						"payment_intent.succeeded",
						"customer.subscription.created",
					]
				);

				await storage.createWebhook({
					productId: createdProduct.id,
					provider: "stripe",
					webhookId: webhook.id,
					url: webhookUrl,
					secret: webhook.secret,
					events: [
						"payment_intent.succeeded",
						"customer.subscription.created",
					],
					status: "active",
				});
			}
		}

		// Generate in LemonSqueezy (using USER\'S API keys)
		if (integrationSettings.createInLemonSqueezy && lemonCredential) {
			const stores = await lemonSqueezyService.getStores(lemonCredential);
			const storeId = stores.data[0]?.id;

			if (storeId) {
				const lsProduct = await lemonSqueezyService.createProduct(
					lemonCredential,
					storeId,
					product.name,
					product.description
				);

				await storage.updateProduct(createdProduct.id, {
					lemonSqueezyProductId: lsProduct.data.id,
					lemonSqueezyStoreId: storeId,
					lemonSqueezyCredentialId: lemonCredential.id,
				});

				// Create variants in LemonSqueezy
				for (const plan of pricingPlans) {
					const variant = await lemonSqueezyService.createVariant(
						lemonCredential,
						lsProduct.data.id,
						plan.name,
						plan.amount,
						plan.interval === "once" ? null : plan.interval,
						plan.trialDays
					);

					const checkoutUrl =
						await lemonSqueezyService.getCheckoutUrl(
							lemonCredential,
							variant.data.id
						);

					await storage.createPricingPlan(createdProduct.id, {
						...plan,
						lemonSqueezyVariantId: variant.data.id,
						checkoutUrl,
					});
				}

				// Setup webhook if requested
				if (integrationSettings.setupWebhooks) {
					const webhookUrl = `${
						process.env.BASE_URL || "https://autobill.app"
					}/api/webhooks/lemonsqueezy`;
					const events = [
						"order_created",
						"subscription_payment_success",
					];
					const webhook = await lemonSqueezyService.createWebhook(
						lemonCredential,
						storeId,
						webhookUrl,
						events
					);

					await storage.createWebhook({
						productId: createdProduct.id,
						provider: "lemonsqueezy",
						webhookId: webhook.data.id,
						url: webhookUrl,
						secret: webhook.data.attributes.signing_secret,
						events: events,
						status: "active",
					});
				}
			}
		}

		// Update product status
		await storage.updateProduct(createdProduct.id, {
			status: "generated",
		});

		// Generate config files
		const generatedPricingPlans = await storage.getProductPricingPlans(
			createdProduct.id
		);

		await storage.createGeneratedConfig({
			productId: createdProduct.id,
			configType: "json",
			content: JSON.stringify(
				{
					product: createdProduct,
					pricingPlans: generatedPricingPlans,
				},
				null,
				2
			),
		});

		for (const plan of generatedPricingPlans) {
			if (plan.checkoutUrl) {
				const htmlSnippet = codeGenerationService.generateHtmlSnippet(
					plan.checkoutUrl
				);
				await storage.createGeneratedConfig({
					productId: createdProduct.id,
					configType: "html_snippet",
					content: htmlSnippet,
				});

				const reactSnippet = codeGenerationService.generateReactSnippet(
					plan.checkoutUrl
				);
				await storage.createGeneratedConfig({
					productId: createdProduct.id,
					configType: "react_snippet",
					content: reactSnippet,
				});
			}
		}

		res.json({ productId: createdProduct.id, success: true });
	} catch (error: any) {
		console.error("Product generation error:", error);
		res.status(500).json({ message: error.message });
	}
};
