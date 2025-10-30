import { GoogleGenerativeAI } from "@google/generative-ai";

export class AIService {
  private getClient(): GoogleGenerativeAI {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async generateProductDescription(productName: string): Promise<string> {
    try {
      const genAI = this.getClient();
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `You are a helpful assistant that writes compelling product descriptions for SaaS products. Write concise, benefit-focused descriptions that highlight value propositions. Write a compelling product description (2-3 sentences) for a SaaS product called "${productName}". Focus on benefits and value.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      return text || "";
    } catch (error) {
      console.error("AI suggestion error:", error);
      throw new Error("Failed to generate AI suggestion");
    }
  }

  async suggestPricingTiers(
    productName: string,
    description: string,
    features: string
  ): Promise<any> {
    const genAI = this.getClient();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a pricing strategy expert for SaaS products. Based on the product name, description, and a comma-separated list of features, suggest 1 to 3 pricing tiers.
    For each tier, provide a 'name' (e.g., Basic, Pro, Enterprise), 'amount' in USD cents, and an 'interval' ('month', 'year', or 'once').
    The output must be ONLY a valid, raw JSON array of objects. Do not include markdown formatting.
    Example: [{ "name": "Pro", "amount": 2900, "currency": "usd", "interval": "month" }]

    Product Name: ${productName}
    Product Description: ${description}
    Features: ${features}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return JSON.parse(text);
  }
}

export const aiService = new AIService();
