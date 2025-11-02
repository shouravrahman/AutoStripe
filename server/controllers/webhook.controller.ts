import { Request, Response } from "express";
import { storage } from "../storage";

// GET /api/webhooks - Fetch webhooks for a given project
export const getWebhooks = async (req: any, res: Response) => {
	const { projectId } = req.query;

	if (!projectId) {
		return res.status(400).json({ message: "Project ID is required to fetch webhooks." });
	}

	try {
		const webhooks = await storage.getProductWebhooks(projectId);
		res.json(webhooks);
	} catch (error) {
		console.error("Failed to fetch webhooks:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const handleWebhook = async (req: Request, res: Response) => {
	console.log("Received a webhook:");
	console.log("Headers:", req.headers);
	console.log("Body:", req.body);

	// We will add signature verification and processing logic here in the future.

	res.status(200).send("Webhook received");
};
