import { Request, Response } from "express";
import { lemonSqueezySetup, listStores } from "@lemonsqueezy/lemonsqueezy.js";

export const getStoresForApiKey = async (req: Request, res: Response) => {
	const { apiKey } = req.body;

	if (!apiKey) {
		return res.status(400).json({ message: "API Key is required" });
	}

	const originalApiKey = process.env.LEMONSQUEEZY_API_KEY;

	try {
		// Temporarily set up the client with the user's provided key
		lemonSqueezySetup({ apiKey });

		const storesResponse = await listStores({ page: { size: 100 } });

		if (storesResponse.error) {
			throw storesResponse.error;
		}

		if (!storesResponse.data) {
			return res.json([]);
		}

		const stores = storesResponse.data.data.map((store) => ({
			id: store.id,
			name: store.attributes.name,
		}));

		res.json(stores);
	} catch (error: any) {
		res.status(500).json({
			message:
				error.message ||
				"Failed to fetch stores. Please check the API key.",
		});
	} finally {
		// IMPORTANT: Reset the setup to use the app's own API key for subsequent internal operations
		lemonSqueezySetup({ apiKey: originalApiKey });
	}
};
