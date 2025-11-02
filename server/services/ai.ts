import {
	GoogleGenerativeAI,
	GenerationConfig,
	SafetySetting,
	HarmCategory,
	HarmBlockThreshold,
} from "@google/generative-ai";

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

	async getSuggestions(prompt: string): Promise<string> {
		const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
		const result = await model.generateContent(prompt);
		const response = await result.response;
		return response.text();
	}
}

export const aiService = new AiService();
