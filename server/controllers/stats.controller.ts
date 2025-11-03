import { Response, Request } from "express";
import { storage } from "../storage";

export const getStats = async (req: any, res: Response) => {
	try {
		const stats = await storage.getUserStats(req.user.id);
		res.json(stats);
	} catch (error: any) {
		console.error("Failed to fetch stats:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const logUsage = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { featureId, quantity } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Not authenticated." });
        }

        if (!featureId || typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ message: "Invalid featureId or quantity." });
        }

        // TODO: Implement storage.logUsage to save this to your database
        // For now, we'll just log it.
        console.log(`User ${userId} logged ${quantity} for feature ${featureId}`);

        res.status(200).json({ message: "Usage logged successfully." });

    } catch (error: any) {
        console.error("Failed to log usage:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};