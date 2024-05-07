import dbConnect from "@/database/dbConnect";
import apiError from "@/helper/apiError";
import apiResponse from "@/helper/apiResponse";
import User from "@/models/user.model";
import { MessageType } from "@/types/modelsTypes";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
	await dbConnect();

	try {
		const { username, content } = await req.json();
		const getUser = await User.findOne({ username });
		if (!getUser) return apiError("User not found !!", false, 404);
		if (!getUser.isAcceptingMessages)
			return apiError("User is not accepting messages !!", false, 403);

		const newMessage = { content };
		getUser.messages.push(newMessage as MessageType);
		await getUser.save();

		return apiResponse("Message send successfully !!", true, 200);
	} catch (err: any) {
		return apiError(`Faild to send message ${err.message}`, false, 500);
	}
};
