import type { Express } from "express";
import { createServer, type Server } from "http";
import authRoutes from "./auth.routes";
import credentialRoutes from "./credential.routes";
import projectRoutes from "./project.routes";
import productRoutes from "./product.routes";
import aiRoutes from "./ai.routes";
import scraperRoutes from "./scraper.routes";
import statsRoutes from "./stats.routes";
import adminRoutes from "./admin.routes";
import billingRoutes from "./billing.routes";

import webhookRoutes from "./webhook.routes";

export async function registerRoutes(app: Express): Promise<Server> {
	app.use("/api/auth", authRoutes);
	app.use("/api/credentials", credentialRoutes);
	app.use("/api/projects", projectRoutes);
	app.use("/api/products", productRoutes);
	app.use("/api/ai", aiRoutes);
	app.use("/api/scrape", scraperRoutes);
	app.use("/api/stats", statsRoutes);
	app.use("/api/admin", adminRoutes);
	app.use("/api/billing", billingRoutes);
	app.use("/api/webhooks", webhookRoutes);

	const httpServer = createServer(app);
	return httpServer;
}
