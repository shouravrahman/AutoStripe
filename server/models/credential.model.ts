import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const credentialSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		provider: {
			type: String,
			required: true,
		},
		encryptedApiKey: {
			type: String,
			required: true,
		},
		encryptedPublicKey: {
			type: String,
		},
		storeId: {
			type: String, // For LemonSqueezy store ID
		},
		label: {
			type: String,
		},
		isActive: {
			type: Boolean,
			required: true,
			default: true,
		},
	},
	{ timestamps: true }
);

const Credential = models.Credential || model("Credential", credentialSchema);

export default Credential;
