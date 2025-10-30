import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const productSchema = new Schema(
	{
		projectId: {
			type: Schema.Types.ObjectId,
			ref: "Project",
			required: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		stripeProductId: {
			type: String,
		},
		stripeCredentialId: {
			type: Schema.Types.ObjectId,
			ref: "Credential",
		},
		lemonSqueezyProductId: {
			type: String,
		},
		lemonSqueezyStoreId: {
			type: String,
		},
		lemonSqueezyCredentialId: {
			type: Schema.Types.ObjectId,
			ref: "Credential",
		},
		status: {
			type: String,
			required: true,
			default: "draft",
		},
	},
	{ timestamps: true }
);

const Product = models.Product || model("Product", productSchema);

export default Product;
