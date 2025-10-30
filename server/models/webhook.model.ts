import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const webhookSchema = new Schema(
	{
		productId: {
			type: Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		provider: {
			type: String,
			required: true,
		},
		webhookId: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
		secret: {
			type: String,
		},
		events: {
			type: [String],
			required: true,
		},
		status: {
			type: String,
			required: true,
			default: "active",
		},
	},
	{ timestamps: true }
);

const Webhook = models.Webhook || model("Webhook", webhookSchema);

export default Webhook;
