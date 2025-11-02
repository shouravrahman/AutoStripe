import { Request, Response } from "express";
import Credential from "../models/credential.model";
import { encryptApiKey } from "../encryption";

export const createCredential = async (req: Request, res: Response) => {
  try {
    const { provider, apiKey, label } = req.body;
    // @ts-ignore
    const userId = req.user.id;

    if (!provider || !apiKey || !label) {
      return res.status(400).json({ message: "Provider, API key, and label are required" });
    }

    const encryptedApiKey = encryptApiKey(apiKey);

    const credential = await Credential.create({
      userId,
      provider,
      encryptedApiKey,
      label,
    });

    res.status(201).json({
      id: credential._id,
      provider: credential.provider,
      label: credential.label,
      createdAt: credential.createdAt,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error creating credential", error: error.message });
  }
};

export const getCredentials = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const credentials = await Credential.find({ userId }).select("-encryptedApiKey -encryptedPublicKey");

    res.json(credentials);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching credentials", error: error.message });
  }
};

export const deleteCredential = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // @ts-ignore
    const userId = req.user.id;

    const credential = await Credential.findOneAndDelete({ _id: id, userId });

    if (!credential) {
      return res.status(404).json({ message: "Credential not found" });
    }

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting credential", error: error.message });
  }
};