import { Response, Request } from "express";
import { storage } from "../storage";
import { StripeService } from "../services/stripe";
import { LemonSqueezyService } from "../services/lemonsqueezy";
import crypto from "crypto";
import { codeGenerationService } from "../services/code-generation";
import ProductModel from "../models/product.model"; // Import Product model for type checking
import archiver from "archiver"; // Import archiver
import Project from "../models/project.model"; // Import Project model

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
		backendStack,
	} = req.body;

	try {
		// --- Enforce Product Limits ---
		const user = await storage.getUser(req.user.id);
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}
		if (user.subscriptionTier === "free") {
			const projectProducts = await storage.getProjectProducts(projectId);
			if (projectProducts.length >= 1) {
				return res.status(403).json({
					message: "Free plan users are limited to 1 product per project. Please upgrade to create more.",
				});
			}
		}

		// --- Create the base product in our DB ---
		const newProduct = await storage.createProduct(req.user.id, projectId, {
			name: productData.name,
			description: productData.description,
			// features: productData.features, // Features are now per-plan
		});

		let stripeProductId: string | undefined;
		const stripePriceIds: { [key: number]: string } = {};
		let lemonSqueezyProductId: string | undefined;
		const lemonSqueezyVariantIds: { [key: number]: string } = {};
		let lemonSqueezyStoreId: string | undefined;

		// --- Fetch User Credentials ---
		const userCredentials = await storage.getUserCredentials(req.user.id);
		const stripeCredential = userCredentials.find(c => c.provider === "stripe");
		const lemonsqueezyCredential = userCredentials.find(c => c.provider === "lemonsqueezy");

		// --- Create in Stripe if enabled ---
		if (integrationSettings.createInStripe) {
			if (!stripeCredential) {
				throw new Error(
					"Stripe credentials not found. Please add them on the Credentials page."
				);
			}
			const decryptedStripeCredential = await storage.getDecryptedCredential(stripeCredential._id);
			const stripeService = new StripeService(decryptedStripeCredential.apiKey);

			const { stripeProduct, stripePrices } = await stripeService.createProductAndPrices(
				productData,
				pricingPlans
			);

			stripeProductId = stripeProduct.id;
			stripePrices.forEach((p, index) => {
				stripePriceIds[index] = p.id;
			});

			// Automatically create webhook
			if (integrationSettings.webhookUrl) {
				const stripeWebhook = await stripeService.createWebhook(
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
		}

		// --- Create in LemonSqueezy if enabled ---
		if (integrationSettings.createInLemonSqueezy) {
			if (!lemonsqueezyCredential) {
				throw new Error(
					"LemonSqueezy credentials not found. Please add them on the Credentials page."
				);
			}
			const decryptedLemonSqueezyCredential = await storage.getDecryptedCredential(lemonsqueezyCredential._id);
			lemonSqueezyStoreId = decryptedLemonSqueezyCredential.storeId; // Store ID is part of credential
			const lemonSqueezyService = new LemonSqueezyService(decryptedLemonSqueezyCredential.apiKey, lemonSqueezyStoreId);

			const { lemonProduct, lemonVariants } =
				await lemonSqueezyService.createProductAndVariants(
					productData,
					pricingPlans
				);

			lemonSqueezyProductId = lemonProduct.id;
			lemonVariants.forEach((v: any, index: number) => {
				lemonSqueezyVariantIds[index] = v.id;
			});

			// Automatically create webhook
			if (integrationSettings.webhookUrl) {
				const lemonWebhookSecret = crypto.randomBytes(16).toString("hex");
				const lemonWebhook = await lemonSqueezyService.createWebhook(
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
			lemonSqueezyStoreId,
		});

		// --- Generate and Save Code Snippets ---
		const finalProduct = await ProductModel.findById(newProduct.id).populate("plans");
		if (!finalProduct) {
			throw new Error("Failed to retrieve final product after creation.");
		}

		const paymentProviders: ("stripe" | "lemonsqueezy")[] = [];
		if (integrationSettings.createInStripe) paymentProviders.push("stripe");
		if (integrationSettings.createInLemonSqueezy) paymentProviders.push("lemonsqueezy");

		const generatedCode = codeGenerationService.generateCode(finalProduct, {
			backendStack,
			paymentProviders,
		}, {
			stripe: stripeCredential ? await storage.getDecryptedCredential(stripeCredential._id) : null,
			lemonsqueezy: lemonsqueezyCredential ? await storage.getDecryptedCredential(lemonsqueezyCredential._id) : null,
		});

		// Log the code generation event
		// @ts-ignore
		await storage.logCodeGeneration(req.user.id, projectId, finalProduct._id, backendStack);

		res.status(201).json({
			product: finalProduct,
			generatedCode,
		});
	} catch (error: any) {
		console.error("Product generation failed:", error);
		// Check for specific error messages from storage for limits
		if (error.message.includes("Free plan users are limited")) {
			return res.status(403).json({ message: error.message });
		}
		res.status(500).json({
			message: error.message || "Internal server error",
		});
	}
};

export const generateCode = async (req: Request, res: Response) => {
	const { productId, backendStack } = req.body;

	if (!productId || !backendStack) {
		return res.status(400).json({ message: "Product ID and backend stack are required." });
	}

	try {
		const product = await ProductModel.findById(productId).populate("plans");

		if (!product) {
			return res.status(404).json({ message: "Product not found." });
		}

		// @ts-ignore
		const userId = req.user.id;
		const userCredentials = await storage.getUserCredentials(userId);

		const stripeCredential = userCredentials.find(c => c.provider === "stripe");
		const lemonsqueezyCredential = userCredentials.find(c => c.provider === "lemonsqueezy");

		const paymentProviders: ("stripe" | "lemonsqueezy")[] = [];
		if (product.plans.some(p => p.stripePriceId)) {
			paymentProviders.push("stripe");
		}
		if (product.plans.some(p => p.lemonSqueezyVariantId)) {
			paymentProviders.push("lemonsqueezy");
		}

		const generatedCode = codeGenerationService.generateCode(product, {
			backendStack,
			paymentProviders,
		}, {
			stripe: stripeCredential ? await storage.getDecryptedCredential(stripeCredential._id) : null,
			lemonsqueezy: lemonsqueezyCredential ? await storage.getDecryptedCredential(lemonsqueezyCredential._id) : null,
		});

		// Log the code generation event
		// @ts-ignore
		await storage.logCodeGeneration(req.user.id, product.projectId, product._id, backendStack);

		res.json({ code: generatedCode });
	} catch (error: any) {
		console.error("Code generation failed:", error);
		res.status(500).json({
			message: "Failed to generate code. Please try again.",
		});
	}
};

export const previewCode = async (req: Request, res: Response) => {
    const { productData, pricingPlans, backendStack, paymentProviders } = req.body;

    if (!productData || !pricingPlans || !backendStack || !paymentProviders) {
        return res.status(400).json({ message: "Missing required parameters for preview." });
    }

    try {
        const tempProduct = {
            name: productData.name,
            description: productData.description,
            plans: pricingPlans.map(p => ({
                ...p,
                stripePriceId: paymentProviders.includes('stripe') ? 'price_mock_12345' : null,
                lemonSqueezyVariantId: paymentProviders.includes('lemonsqueezy') ? 'variant_mock_12345' : null,
            })),
            userId: req.session.userId,
        };

        // For preview, we don't have actual credentials, so we pass null
        const generatedCode = codeGenerationService.generateCode(tempProduct as any, {
            backendStack,
            paymentProviders,
        }, { stripe: null, lemonsqueezy: null });

        res.json({ code: generatedCode });

    } catch (error: any) {
        console.error("Code preview failed:", error);
        res.status(500).json({
            message: "Failed to generate code preview. Please try again.",
        });
    }
};

export const downloadCode = async (req: Request, res: Response) => {
    const { productId, backendStack } = req.query;

    if (!productId || !backendStack) {
        return res.status(400).json({ message: "Product ID and backend stack are required." });
    }

    try {
        const product = await ProductModel.findById(productId).populate("plans");
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // @ts-ignore
        const userId = req.user.id;
        const userCredentials = await storage.getUserCredentials(userId);

        const stripeCredential = userCredentials.find(c => c.provider === "stripe");
        const lemonsqueezyCredential = userCredentials.find(c => c.provider === "lemonsqueezy");

        const paymentProviders: ("stripe" | "lemonsqueezy")[] = [];
        if (product.plans.some(p => p.stripePriceId)) paymentProviders.push("stripe");
        if (product.plans.some(p => p.lemonSqueezyVariantId)) paymentProviders.push("lemonsqueezy");

        const generatedCode = codeGenerationService.generateCode(product, {
            backendStack: backendStack as string,
            paymentProviders,
        }, {
			stripe: stripeCredential ? await storage.getDecryptedCredential(stripeCredential._id) : null,
			lemonsqueezy: lemonsqueezyCredential ? await storage.getDecryptedCredential(lemonsqueezyCredential._id) : null,
		});

        const archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });

        archive.on('error', function(err) {
            throw err;
        });

        // Set the headers
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename=${product.name.replace(/\s+/g, '-').toLowerCase()}-autobill.zip`);

        // Pipe archive data to the response
        archive.pipe(res);

        // Append files from the generatedCode object
        for (const [filePath, content] of Object.entries(generatedCode)) {
            archive.append(content, { name: filePath });
        }

        // Finalize the archive (ie we are done appending files but streams have to finish yet)
        await archive.finalize();

    } catch (error: any) {
        console.error("Code download failed:", error);
        res.status(500).json({
            message: "Failed to generate code for download.",
        });
    }
};