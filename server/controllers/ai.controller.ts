import { Request, Response } from "express";
import { storage } from "../storage";
import { aiService } from "../services/ai";
import {
	generateJsonConfig,
	generateNextJsComponent,
	generateNodeWebhook,
} from "../services/code-generation";

export const suggestDescription = async (req: Request, res: Response) => {
	try {
		const userId = req.session?.userId;
		if (!userId)
			return res.status(401).json({ message: "Not authenticated" });

		const user = await storage.getUser(userId);
		if (user?.subscriptionStatus === "free") {
			return res
				.status(403)
				.json({ message: "Upgrade to Pro to use AI suggestions." });
		}

		const { productName } = req.body;
		const suggestion = await aiService.generateProductDescription(
			productName
		);

		res.json({ suggestion });
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

export const suggestPricingTiers = async (req: Request, res: Response) => {
	try {
		const userId = req.session?.userId;
		if (!userId)
			return res.status(401).json({ message: "Not authenticated" });

		const user = await storage.getUser(userId);
		if (user?.subscriptionStatus === "free") {
			return res
				.status(403)
				.json({ message: "Upgrade to Pro to use AI suggestions." });
		}

		const { productName, description, features } = req.body;
		const suggestion = await aiService.suggestPricingTiers(
			productName,
			description,
			features
		);

		res.json({ suggestion });
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

export const getGeneratedCode = async (req: Request, res: Response) => {
	try {
		const userId = req.session?.userId;
		if (!userId)
			return res.status(401).json({ message: "Not authenticated" });

		const user = await storage.getUser(userId);
		if (user?.subscriptionStatus === "free") {
			return res
				.status(403)
				.json({ message: "Upgrade to Pro to generate code snippets." });
		}

		const { product, generationType } = req.body;

		if (!product || !generationType) {
			return res
				.status(400)
				.json({
					message: "Product data and generation type are required.",
				});
		}

		let generatedCode = "";
		switch (generationType) {
			case "json":
				generatedCode = generateJsonConfig(product);
				break;
			case "nextjs":
				generatedCode = generateNextJsComponent(product);
				break;
			case "node":
				generatedCode = generateNodeWebhook(product);
				break;
			default:
				return res
					.status(400)
					.json({ message: "Invalid generation type." });
		}

		res.json({ code: generatedCode });
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};
