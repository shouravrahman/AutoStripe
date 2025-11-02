import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const projectSchema = new Schema(
	{
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
		status: {
			type: String,
			required: true,
			default: "active",
		},
	},
	{ timestamps: true, toJSON: { virtuals: true } }
);

const Project = models.Project || model("Project", projectSchema);

export default Project;
