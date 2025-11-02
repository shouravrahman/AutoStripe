import { Response } from "express";
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
