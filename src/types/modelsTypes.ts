import { Document } from "mongoose";

export interface MessageType extends Document {
	content: string;
	createdAt: Date;
}

export interface UserType extends Document {
	username: string;
	email: string;
	password: string;
	verifyCode: string;
	verifyCodeExpiry: Date;
	isVerified: boolean;
	isAcceptingMessages: boolean;
	messages: MessageType[];
}
