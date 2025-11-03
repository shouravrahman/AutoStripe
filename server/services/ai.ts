import {
	GoogleGenerativeAI,
	GenerationConfig,
	SafetySetting,
	HarmCategory,
	HarmBlockThreshold,
} from "@google/generative-ai";

interface PricingPlanInput {
    name: string;
    price: number;
    interval: "month" | "year" | "once";
    features: string;
}

class AiService {
	private genAI: GoogleGenerativeAI;

	constructor() {
		// if (!process.env.GOOGLE_API_KEY) {
		// 	throw new Error("GOOGLE_API_KEY is not configured.");
		// }
		this.genAI = new GoogleGenerativeAI(
			process.env.GOOGLE_API_KEY || "bwuefbj"
		);
	}

	async getSuggestions(
		productName: string,
		productDescription: string,
		existingPricingPlans: PricingPlanInput[]
	): Promise<string> {
		const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });

		let prompt = `
        Act as an expert SaaS consultant and product strategist. Your goal is to help a developer optimize the pricing and feature bundling for their new SaaS product.

        Product Name: "${productName}"
        Product Description: "${productDescription}"

        `;

		if (existingPricingPlans && existingPricingPlans.length > 0) {
			prompt += `
        Here are the currently identified pricing plans (either scraped or manually entered). Analyze them and suggest improvements or new tiers.
        Existing Plans: ${JSON.stringify(existingPricingPlans, null, 2)}
        `;
		} else {
			prompt += `
        No existing pricing plans have been identified yet. Please suggest a comprehensive pricing strategy from scratch.
        `;
		}

		prompt += `
        Based on the product information and existing plans (if any), provide the following in a clear, structured JSON format. Do not include any explanatory text outside of the JSON structure.

        Your response must be a single JSON object with these exact keys: "refinedDescription", "pricingTiers", "monetizationStrategy", "featureBundlingIdeas".

        1.  **refinedDescription**: Rewrite the product description to be more compelling, benefit-oriented, and marketable. It should be a single string of text.

        2.  **pricingTiers**: Suggest three distinct pricing tiers (e.g., Basic, Pro, Enterprise). For each tier, provide:
            -   **name**: The name of the tier (e.g., "Starter", "Growth", "Scale").
            -   **price**: A suggested monthly price in USD (just the number, e.g., 19, 49, 99). If a one-time payment, specify that in the justification.
            -   **interval**: "month", "year", or "once".
            -   **features**: A bulleted list of 3-5 *key* features for that tier. Be specific about what a user gets at each level to encourage upgrades. Focus on value-based features.
            -   **justification**: A brief explanation of why this pricing is suitable for the target audience and the value provided, considering potential operational costs, market competition, and upgrade paths.

        3.  **monetizationStrategy**: A brief analysis (1-2 paragraphs) of the most suitable monetization model (e.g., freemium, tiered, usage-based, per-seat, hybrid) for this product, justifying your choice.

        4.  **featureBundlingIdeas**: A list of 3-5 ideas for how features could be bundled across tiers to maximize upgrades and perceived value.

        Example of a single pricing tier object:\n        {\n            "name": "Pro",\n            "price": 49,\n            "interval": "month",\n            "features": ["- Feature A", "- Feature B", "- Priority Support"],\n            "justification": "This tier is priced for small teams who need more advanced features, offering a clear upgrade path from the basic plan."
        }\n    `;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		return response.text();
	}
}

export const aiService = new AiService();