
import { Request, Response } from "express";
import Credential from "../models/credential.model";
import { encryptApiKey } from "../encryption";
import Doppler from "@dopplerhq/node-sdk";

// ... [createCredential, getCredentials, deleteCredential functions remain the same] ...

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


export const connectDoppler = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { dopplerToken, projectName, environmentName, secrets } = req.body;

        if (!dopplerToken || !projectName || !environmentName || !secrets) {
            return res.status(400).json({ message: "Doppler token, project, environment, and secrets are required." });
        }

        const doppler = new Doppler({ accessToken: dopplerToken });

        // Format secrets for the Doppler API
        const secretsToUpdate = {
            STRIPE_SECRET_KEY: secrets.stripe_sk,
            STRIPE_WEBHOOK_SECRET: secrets.stripe_whsec,
            LEMONSQUEEZY_API_KEY: secrets.lemonsqueezy_apikey,
            LEMONSQUEEZY_WEBHOOK_SECRET: secrets.lemonsqueezy_whsec,
        };

        await doppler.secrets.update(projectName, environmentName, {
            secrets: secretsToUpdate,
        });

        // Save a reference to the Doppler integration in our database
        const credential = await Credential.create({
            userId,
            provider: "doppler",
            label: `Doppler - ${projectName}`,
            // Store the project/environment as metadata instead of encrypted keys
            metadata: {
                project: projectName,
                environment: environmentName,
            }
        });

        res.status(201).json({ message: "Successfully connected to Doppler and saved secrets.", id: credential._id });

    } catch (error: any) {
        console.error("Doppler connection failed:", error);
        res.status(500).json({ message: "Failed to connect to Doppler.", error: error.message });
    }
};
