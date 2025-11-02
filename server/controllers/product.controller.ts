import { Response } from "express";
import { storage } from "../storage";
import { createStripeProduct, createStripeWebhook } from "../services/stripe";
import {
	createLemonSqueezyProduct,
	createLemonSqueezyWebhook,
} from "../services/lemonsqueezy";
import crypto from "crypto";
import { decryptApiKey } from "../encryption";
import { codeGenerationService } from "../services/code-generation";

// GET /api/products - Fetch all products for the logged-in user, optionally filtered by project
export const getProducts = async (req: any, res: Response) => {
	const { projectId } = req.query;
	try {
		let products;
		if (projectId) {
			products = await storage.getProjectProducts(projectId);
		} else {
			products = await storage.getUserProducts(req.user.id);
		}
		res.json(products);
	} catch (error) {
		console.error("Failed to fetch products:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const generateProduct = async (req: any, res: Response) => {
	const {
		projectId,
		product: productData,
		pricingPlans,
		integrationSettings,
		frontendStack,
		backendStack,
		generationTarget,
	} = req.body;

	try {
		// --- Create the base product in our DB ---
		const newProduct = await storage.createProduct(req.user.id, projectId, {
			name: productData.name,
			description: productData.description,
			features: productData.features,
		});

		let stripeProductId: string | undefined;
		const stripePriceIds: { [key: number]: string } = {};
		let lemonSqueezyProductId: string | undefined;
		const lemonSqueezyVariantIds: { [key: number]: string } = {};
		let stripeWebhookSecret: string | undefined;
		let lemonSqueezyStoreUrl: string | undefined;

		// --- Create in Stripe if enabled ---
		if (integrationSettings.createInStripe) {
			if (!integrationSettings.webhookUrl) {
				throw new Error(
					"Webhook URL is required for Stripe integration."
				);
			}

			const credentials = await storage.getUserCredentials(req.user.id);
			const stripeCredential = credentials.find(
				(c) => c.provider === "stripe"
			);

			if (!stripeCredential) {
				throw new Error(
					"Stripe credentials not found. Please add them on the Credentials page."
				);
			}

			const decryptedApiKey = decryptApiKey(
				stripeCredential.encryptedApiKey
			);

			const { stripeProduct, stripePrices } = await createStripeProduct(
				decryptedApiKey,
				productData,
				pricingPlans
			);

			stripeProductId = stripeProduct.id;
			stripePrices.forEach((p, index) => {
				stripePriceIds[index] = p.id;
			});

			// Automatically create webhook
			const stripeWebhook = await createStripeWebhook(
				decryptedApiKey,
				integrationSettings.webhookUrl
			);
			await storage.createWebhook({
				userId: req.user.id,
				provider: "stripe",
				webhookId: stripeWebhook.id,
				secret: stripeWebhook.secret, // Secret is returned on creation
				stripeWebhookSecret: stripeWebhook.secret,
				url: integrationSettings.webhookUrl,
			});
		}

		// --- Create in LemonSqueezy if enabled ---
		if (integrationSettings.createInLemonSqueezy) {
			if (!integrationSettings.webhookUrl) {
				throw new Error(
					"Webhook URL is required for LemonSqueezy integration."
				);
			}
			const credentials = await storage.getUserCredentials(req.user.id);
			const lemonCredential = credentials.find(
				(c) => c.provider === "lemonsqueezy"
			);

			if (!lemonCredential) {
				throw new Error(
					"LemonSqueezy credentials not found. Please add them on the Credentials page."
				);
			}

			const decryptedApiKey = decryptApiKey(
				lemonCredential.encryptedApiKey
			);
			// Construct the store URL from the store ID
			lemonSqueezyStoreUrl = `https://app.lemonsqueezy.com/my-stores/${lemonCredential.storeId}`;

			const { lemonProduct, lemonVariants } =
				await createLemonSqueezyProduct(
					decryptedApiKey,
					lemonCredential.storeId,
					productData,
					pricingPlans
				);

			lemonSqueezyProductId = lemonProduct.id;
			lemonVariants.forEach((v, index) => {
				lemonSqueezyVariantIds[index] = v.id;
			});

			// Automatically create webhook
			const lemonWebhookSecret = crypto.randomBytes(16).toString("hex");
			const lemonWebhook = await createLemonSqueezyWebhook(
				decryptedApiKey,
				lemonCredential.storeId,
				integrationSettings.webhookUrl,
				lemonWebhookSecret
			);

			if (!lemonWebhook.data) {
				throw new Error("Failed to create LemonSqueezy webhook.");
			}

			await storage.createWebhook({
				userId: req.user.id,
				provider: "lemonsqueezy",
				webhookId: lemonWebhook.data.data.id,
				secret: lemonWebhookSecret,
				url: integrationSettings.webhookUrl,
			});
		}

		// --- Create pricing plans in our DB ---
		for (let i = 0; i < pricingPlans.length; i++) {
			const plan = pricingPlans[i];
			await storage.createPricingPlan(newProduct.id, {
				...plan,
				stripePriceId: stripePriceIds[i],
				lemonSqueezyVariantId: lemonSqueezyVariantIds[i],
			});
		}

		// --- Update our product with the new platform ID ---
		const updatedProduct = await storage.updateProduct(newProduct.id, {
			stripeProductId,
			lemonSqueezyProductId,
		});

		// --- Generate and Save Code Snippets ---
		const finalProduct = await storage.getProductById(newProduct.id);
		if (!finalProduct) {
			throw new Error("Failed to retrieve final product after creation.");
		}

		const nextJsComponent = codeGenerationService.generateNextJsComponent(
			finalProduct,
			lemonSqueezyStoreUrl || ""
		);
		const nodeWebhookHandler = codeGenerationService.generateNodeWebhook(
			finalProduct,
			stripeWebhookSecret || ""
		);
		const jsonConfig =
			codeGenerationService.generateJsonConfig(finalProduct);

		await storage.createGeneratedConfig({
			productId: finalProduct.id,
			nextjs_component: nextJsComponent,
			node_webhook_handler: nodeWebhookHandler,
			json_config: jsonConfig,
		});

		res.status(201).json({
			product: finalProduct,
			generatedCode: { nextJsComponent, nodeWebhookHandler, jsonConfig },
		});
	} catch (error: any) {
		console.error("Product generation failed:", error);
		res.status(500).json({
			message: error.message || "Internal server error",
		});
	}
};
