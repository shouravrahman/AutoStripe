import { Request, Response } from "express";
import { storage } from "../storage";

export const createCredential = async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const { provider, apiKey, publicKey, label } = req.body;

    const credential = await storage.createCredential(userId, {
      provider,
      encryptedApiKey: apiKey,
      encryptedPublicKey: publicKey || null,
      label,
    });

    res.json(credential);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getCredentials = async (req: Request, res: Response) => {
  const userId = req.session?.userId;
  if (!userId) return res.status(401).json({ message: "Not authenticated" });

  const credentials = await storage.getUserCredentials(userId);
  res.json(credentials);
};

export const deleteCredential = async (req: Request, res: Response) => {
  const userId = req.session?.userId;
  if (!userId) return res.status(401).json({ message: "Not authenticated" });

  const credential = await storage.getCredentialById(req.params.id);
  if (!credential || credential.userId !== userId) {
    return res.status(404).json({ message: "Credential not found" });
  }

  await storage.deleteCredential(req.params.id);
  res.json({ success: true });
};
