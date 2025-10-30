import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const generatedConfigSchema = new Schema(
	{
		productId: {
			type: Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		configType: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const GeneratedConfig =
	models.GeneratedConfig || model("GeneratedConfig", generatedConfigSchema);

export default GeneratedConfig;
