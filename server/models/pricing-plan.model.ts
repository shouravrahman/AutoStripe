import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const pricingPlanSchema = new Schema(
	{
		productId: {
			type: Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		currency: {
			type: String,
			required: true,
			default: "usd",
		},
		interval: {
			type: String,
			required: true,
		},
		trialDays: {
			type: Number,
			default: 0,
		},
		stripePriceId: {
			type: String,
		},
		lemonSqueezyVariantId: {
			type: String,
		},
		checkoutUrl: {
			type: String,
		},
	},
	{ timestamps: true }
);

const PricingPlan =
	models.PricingPlan || model("PricingPlan", pricingPlanSchema);

export default PricingPlan;
