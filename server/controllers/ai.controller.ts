import { Request, Response } from "express";
import { aiService } from "../services/ai";
import { codeGenerationService } from "../services/code-generation";
import Product from "../models/product.model";

export const getSuggestions = async (req: Request, res: Response) => {
	const { name, description, features, targetAudience } = req.body;

	if (!name) {
		return res.status(400).json({ message: "Product name is required." });
	}

	const prompt = `
        Act as an expert SaaS consultant and product strategist. Your goal is to help a developer make their new product, "${name}", as profitable as possible.

        Here is the current product information:
        - Description: "${description || "Not provided."}"
        - Features: "${features || "Not provided."}"
        - Target Audience: "${targetAudience || "Not provided."}"

        Based on this, provide the following in a clear, structured JSON format. Do not include any explanatory text outside of the JSON structure.

        Your response must be a single JSON object with these exact keys: "refinedDescription", "pricingTiers".

        1.  **refinedDescription**: Rewrite the product description to be more compelling, benefit-oriented, and marketable. It should be a single string of text.

        2.  **pricingTiers**: Suggest three distinct pricing tiers (e.g., Basic, Pro, Enterprise). For each tier, provide:
            -   **name**: The name of the tier (e.g., "Starter", "Growth", "Scale").
            -   **price**: A suggested monthly price in USD (e.g., 19, 49, 99). Just the number.
            -   **features**: A bulleted list of 3-5 key features for that tier. Be specific about what a user gets at each level to encourage upgrades.
            -   **justification**: A brief explanation of why this pricing is suitable for the target audience and the value provided, considering potential operational costs and market competition.

        Example of a single pricing tier object:
        {
            "name": "Pro",
            "price": 49,
            "features": ["- Feature A", "- Feature B", "- Priority Support"],
            "justification": "This tier is priced for small teams who need more advanced features, offering a clear upgrade path from the basic plan."
        }
    `;

	try {
		const rawResponse = await aiService.getSuggestions(prompt);
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

		// Determine which payment providers are being used
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

		res.json({ code: generatedCode });
	} catch (error: any) {
		console.error("Code generation failed:", error);
		res.status(500).json({
			message: "Failed to generate code. Please try again.",
		});
	}
};
