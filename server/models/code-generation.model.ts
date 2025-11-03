
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const codeGenerationSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		projectId: {
			type: Schema.Types.ObjectId,
			ref: "Project",
			required: true,
		},
		productId: {
			type: Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		backendStack: {
			type: String,
			required: true,
		},
		timestamp: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

const CodeGeneration = models.CodeGeneration || model("CodeGeneration", codeGenerationSchema);

export default CodeGeneration;
