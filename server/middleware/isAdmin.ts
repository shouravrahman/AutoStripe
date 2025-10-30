import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const user = await storage.getUser(userId);
  if (user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};