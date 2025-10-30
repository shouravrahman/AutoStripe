import { Request, Response } from "express";
import { storage } from "../storage";

export const getStats = async (req: Request, res: Response) => {
  const userId = req.session?.userId;
  if (!userId) return res.status(401).json({ message: "Not authenticated" });

  const stats = await storage.getUserStats(userId);
  res.json(stats);
};
