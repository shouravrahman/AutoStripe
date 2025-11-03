import { Request, Response } from "express";
import { aiService } from "../services/ai";
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