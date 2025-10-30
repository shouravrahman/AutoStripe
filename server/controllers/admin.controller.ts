import { Request, Response } from "express";
import { storage } from "../storage";

export const getUsers = async (req: Request, res: Response) => {
  const users = await storage.getAllUsers();
  res.json(users);
};

export const getStats = async (req: Request, res: Response) => {
  const stats = await storage.getAdminStats();
  res.json(stats);
};
