import { Request, Response } from "express";
import { aiService } from "../services/ai";
import { codeGenerationService } from "../services/code-generation";
import Product from "../models/product.model";
import archiver from "archiver";
import { storage } from "../storage"; // Import storage

export const getSuggestions = async (req: Request, res: Response) => {
	const { productName, productDescription, existingPricingPlans } = req.body;

	// @ts-ignore
	const userId = req.user.id;
	if (!userId) {
		return res.status(401).json({ message: "Not authenticated." });
	}

	try {
		const user = await storage.getUser(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		if (user.subscriptionTier === "free") {
			return res.status(403).json({ message: "AI suggestions are a Pro feature. Please upgrade your plan." });
		}

		if (!productName) {
			return res.status(400).json({ message: "Product name is required." });
		}

		const rawResponse = await aiService.getSuggestions(
			productName,
			productDescription || "",
			existingPricingPlans || []
		);
		// Clean the response to ensure it's valid JSON
		const jsonResponse = rawResponse
			.replace(/```json/g, "")
			.replace(/```/g, "")
			.trim();
		const suggestions = JSON.parse(jsonResponse);
		res.json(suggestions);
	} catch (error: any) {
		console.error("AI suggestion failed:", error);
		res.status(500).json({
			message: "Failed to get AI suggestions. Please try again.",
		});
	}
};

export const generateCode = async (req: Request, res: Response) => {
	const { productId, backendStack } = req.body;

	if (!productId || !backendStack) {
		return res.status(400).json({ message: "Product ID and backend stack are required." });
	}

	try {
		const product = await Product.findById(productId).populate("plans");

		if (!product) {
			return res.status(404).json({ message: "Product not found." });
		}

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

        const generatedCode = codeGenerationService.generateCode(tempProduct as any, {
            backendStack,
            paymentProviders,
        });

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
        const product = await Product.findById(productId).populate("plans");
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        const paymentProviders: ("stripe" | "lemonsqueezy")[] = [];
        if (product.plans.some(p => p.stripePriceId)) paymentProviders.push("stripe");
        if (product.plans.some(p => p.lemonSqueezyVariantId)) paymentProviders.push("lemonsqueezy");

        const generatedCode = codeGenerationService.generateCode(product, {
            backendStack: backendStack as string,
            paymentProviders,
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