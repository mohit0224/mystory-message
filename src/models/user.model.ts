import { MessageType, UserType } from "@/types/modelsTypes";
import mongoose, { Schema } from "mongoose";

const messageSchema: Schema<MessageType> = new Schema(
	{
		content: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const userSchema: Schema<UserType> = new Schema(
	{
		username: {
			type: String,
			required: [true, "Username is required !!"],
			trim: true,
			unique: true,
		},
		email: {
			type: String,
			required: [true, "Email is required !!"],
			unique: true,
			match: [/.+\@.+\..+/, "Please enter a valid email address !!"],
		},
		password: {
			type: String,
			required: [true, "Password is required !!"],
		},
		verifyCode: {
			type: String,
			required: [true, "Verify Code is required"],
		},
		verifyCodeExpiry: {
			type: Date,
			required: [true, "Verify Code Expiry is required"],
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		isAcceptingMessages: {
			type: Boolean,
			default: true,
		},
		messages: [messageSchema],
	},
	{ timestamps: true }
);

const User =
	(mongoose.models.User as mongoose.Model<UserType>) ||
	mongoose.model<UserType>("User", userSchema);
export default User;
