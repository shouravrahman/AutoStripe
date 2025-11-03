import bcrypt from "bcryptjs";
import { encryptApiKey, decryptApiKey } from "./encryption";
import User from "./models/user.model";
import Credential from "./models/credential.model";
import Project from "./models/project.model";
import Product from "./models/product.model";
import PricingPlan from "./models/pricing-plan.model";
import Webhook from "./models/webhook.model";
import GeneratedConfig from "./models/generated-config.model";
import CodeGeneration from "./models/code-generation.model"; // Import new model
import { Schema } from "mongoose";

export interface IStorage {
	// Users
	getUser(id: string): Promise<any | undefined>;
	getUserByEmail(email: string): Promise<any | undefined>;
	createUser(user: any): Promise<any>;
	updateUser(id: string, updates: Partial<any>): Promise<any | undefined>;
	updateUserSubscription(
		userId: string,
		status: string,
		subscriptionId: string | null,
		subscriptionTier: string
	): Promise<any>;

	// User Credentials
	createCredential(userId: string, credential: any): Promise<any>;
	getUserCredentials(userId: string): Promise<any[]>;
	getCredentialById(id: string): Promise<any | undefined>;
	getDecryptedCredential(id: string): Promise<any | undefined>; // New method
	deleteCredential(id: string): Promise<void>;

	// Projects
	createProject(userId: string, project: any): Promise<any>;
	getUserProjects(userId: string): Promise<any[]>;
	getProjectById(id: string): Promise<any | undefined>;
	updateProject(id: string, updates: Partial<any>): Promise<any | undefined>;
	deleteProject(id: string): Promise<void>;

	// Products
	createProduct(
		userId: string,
		projectId: string,
		product: any
	): Promise<any>;
	getUserProducts(userId: string): Promise<any[]>;
	getProjectProducts(projectId: string): Promise<any[]>;
	getProductById(id: string): Promise<any | undefined>;
	updateProduct(id: string, updates: Partial<any>): Promise<any | undefined>;
	deleteProduct(id: string): Promise<void>;

	// Pricing Plans
	createPricingPlan(productId: string, plan: any): Promise<any>;
	getProductPricingPlans(productId: string): Promise<any[]>;

	// Webhooks
	createWebhook(webhook: any): Promise<any>;
	getProductWebhooks(productId: string): Promise<any[]>;

	// Generated Configs
	createGeneratedConfig(config: any): Promise<any>;
	getProductConfigs(productId: string): Promise<any[]>;

	// Code Generations
	logCodeGeneration(
		userId: string,
		projectId: string,
		productId: string,
		backendStack: string
	): Promise<any>;

	// Stats
	getUserStats(userId: string): Promise<any>;
	getAdminStats(): Promise<any>;
	getAllUsers(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
	// Users
	async getUser(id: string) {
		return await User.findById(id);
	}

	async getUserByEmail(email: string) {
		return await User.findOne({ email });
	}

	async createUser(insertUser: any) {
		const hashedPassword = await bcrypt.hash(insertUser.password, 10);
		const user = new User({
			...insertUser,
			password: hashedPassword,
		});
		return await user.save();
	}

	async updateUser(id: string, updates: Partial<any>) {
		return await User.findByIdAndUpdate(id, updates, { new: true });
	}

	// User Credentials
	async createCredential(userId: string, credential: any) {
		const encrypted = {
			...credential,
			encryptedApiKey: encryptApiKey(credential.apiKey),
			encryptedPublicKey: credential.publicKey
				? encryptApiKey(credential.publicKey)
				: undefined,
			storeId: credential.storeId,
		};

		const newCredential = new Credential({
			userId,
			...encrypted,
		});
		return await newCredential.save();
	}

	async getUserCredentials(userId: string) {
		return await Credential.find({ userId });
	}

	async getCredentialById(id: string) {
		return await Credential.findById(id);
	}

	async getDecryptedCredential(id: string) {
		const credential = await Credential.findById(id);
		if (!credential) {
			return undefined;
		}

		// Decrypt API key and public key if they exist
		const decryptedApiKey = credential.encryptedApiKey
			? decryptApiKey(credential.encryptedApiKey)
			: undefined;
		const decryptedPublicKey = credential.encryptedPublicKey
			? decryptApiKey(credential.encryptedPublicKey)
			: undefined;

		return {
			...credential.toObject(), // Convert Mongoose document to plain object
			apiKey: decryptedApiKey,
			publicKey: decryptedPublicKey,
			encryptedApiKey: undefined, // Remove encrypted versions
			encryptedPublicKey: undefined,
		};
	}

	async deleteCredential(id: string): Promise<void> {
		await Credential.findByIdAndDelete(id);
	}

	// Projects
	async createProject(userId: string, project: any) {
		const user = await User.findById(userId);
		if (!user) {
			throw new Error("User not found.");
		}

		if (user.subscriptionTier === "free") {
			const userProjects = await this.getUserProjects(userId);
			if (userProjects.length >= 1) {
				// Limit free tier to 1 project
				throw new Error(
					"Free plan users are limited to 1 project. Please upgrade to create more."
				);
			}
		}

		const newProject = new Project({
			userId,
			...project,
		});
		return await newProject.save();
	}

	async getUserProjects(userId: string) {
		return await Project.find({ userId }).sort({ createdAt: -1 });
	}

	async getProjectById(id: string) {
		return await Project.findById(id);
	}

	async updateProject(id: string, updates: Partial<any>) {
		return await Project.findByIdAndUpdate(id, updates, { new: true });
	}

	async deleteProject(id: string): Promise<void> {
		await Credential.findByIdAndDelete(id);
	}

	// Products
	async createProduct(userId: string, projectId: string, product: any) {
		const user = await User.findById(userId);
		if (!user) {
			throw new Error("User not found.");
		}

		if (user.subscriptionTier === "free") {
			const projectProducts = await this.getProjectProducts(projectId);
			if (projectProducts.length >= 1) {
				// Limit free tier to 1 product per project
				throw new Error(
					"Free plan users are limited to 1 product per project. Please upgrade to create more."
				);
			}
		}

		const newProduct = new Product({
			userId,
			projectId,
			...product,
		});
		return await newProduct.save();
	}

	async getUserProducts(userId: string) {
		return await Product.find({ userId }).sort({ createdAt: -1 });
	}

	async getProjectProducts(projectId: string) {
		return await Product.find({ projectId }).sort({ createdAt: -1 });
	}

	async getProductById(id: string) {
		return await Product.findById(id);
	}

	async updateProduct(id: string, updates: Partial<any>) {
		return await Product.findByIdAndUpdate(id, updates, { new: true });
	}

	async deleteProduct(id: string): Promise<void> {
		await Product.findByIdAndDelete(id);
	}

	// Pricing Plans
	async createPricingPlan(productId: string, plan: any) {
		const newPricingPlan = new PricingPlan({
			...plan,
			productId,
		});
		return await newPricingPlan.save();
	}

	async getProductPricingPlans(productId: string) {
		return await PricingPlan.find({ productId });
	}

	// Webhooks
	async createWebhook(webhook: any) {
		const newWebhook = new Webhook(webhook);
		return await newWebhook.save();
	}

	async getProductWebhooks(productId: string) {
		return await Webhook.find({ productId });
	}

	// Generated Configs
	async createGeneratedConfig(config: any) {
		const newGeneratedConfig = new GeneratedConfig(config);
		return await newGeneratedConfig.save();
	}

	async getProductConfigs(productId: string) {
		return await GeneratedConfig.find({ productId });
	}

	// Code Generations
	async logCodeGeneration(
		userId: string,
		projectId: string,
		productId: string,
		backendStack: string
	) {
		const newCodeGeneration = new CodeGeneration({
			userId,
			projectId,
			productId,
			backendStack,
		});
		return await newCodeGeneration.save();
	}

	// Stats
	async getUserStats(userId: string) {
		const userProjects = await this.getUserProjects(userId);
		const userProducts = await this.getUserProducts(userId);
		const credentials = await this.getUserCredentials(userId);
		const totalCodeGenerations = await CodeGeneration.countDocuments({
			userId,
		});

		const totalWebhooks = await Promise.all(
			userProducts.map((p) => this.getProductWebhooks(p._id))
		).then((results) => results.flat().length);

		// Calculate estimated time saved
		// Assumptions: 15 minutes per project setup, 10 minutes per product setup
		const timeSavedPerProject = 15; // minutes
		const timeSavedPerProduct = 20; // minutes
		const estimatedTimeSaved =
			userProjects.length * timeSavedPerProject +
			userProducts.length * timeSavedPerProduct;

		return {
			totalProjects: userProjects.length,
			totalProducts: userProducts.length,
			totalCodeGenerations: totalCodeGenerations,
			totalWebhooks,
			platformsConnected: credentials.filter((c) => c.isActive).length,
			estimatedTimeSaved: estimatedTimeSaved,
		};
	}

	async getAdminStats() {
		const allUsers = await this.getAllUsers();
		const allProducts = await Product.find();

		return {
			totalUsers: allUsers.length,
			activeUsers: allUsers.filter((u) => u.subscriptionStatus !== "free")
				.length,
			totalProducts: allProducts.length,
		};
	}

	async updateUserSubscription(
		userId: string,
		status: string,
		subscriptionId: string | null,
		subscriptionTier: string
	) {
		return await User.findByIdAndUpdate(userId, {
			subscriptionStatus: status,
			subscriptionId: subscriptionId,
			subscriptionTier: subscriptionTier,
		});
	}

	async getAllUsers() {
		return await User.find().sort({ createdAt: -1 });
	}
}

export const storage = new DatabaseStorage();
