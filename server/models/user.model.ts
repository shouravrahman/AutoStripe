import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
		},
		role: {
			type: String,
			required: true,
			default: "user",
		},
		subscriptionStatus: {
			type: String,
			default: "free",
		},
		subscriptionId: {
			type: String,
		},
	},
	{ timestamps: true }
);

const User = models.User || model("User", userSchema);

export default User;
