import { Request, Response } from "express";
import { storage } from "../storage";
import { scraperService } from "../services/scraper";

export const extractProductInfo = async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const user = await storage.getUser(userId);
    if (user?.subscriptionStatus === "free") {
      return res
        .status(403)
        .json({ message: "Upgrade to Pro to use web scraping." });
    }

    const { url } = req.body;
    const extractedData = await scraperService.extractProductInfo(url);

    res.json({ extractedData });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
