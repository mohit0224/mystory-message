import { NextRequest } from "next/server";
import dbConnect from "@/database/dbConnect";
import apiError from "@/helper/apiError";
import apiResponse from "@/helper/apiResponse";
import { getServerSession } from "next-auth";
import User from "@/models/user.model";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export const GET = async (req: NextRequest) => {
	await dbConnect();

	try {
		const session = await getServerSession(authOptions);
		if (session === null) apiError("User not loggedIn !!", false, 400);
		const activeUser = session?.user;
		if (!session || !activeUser) apiError("User not loggedIn !!", false, 400);
		const userID = new mongoose.Types.ObjectId(activeUser._id);

		// aggregation pipeline ------------------------------------------------
		const getMessages = await User.aggregate([
			{ $match: { _id: userID } },
			{ $unwind: "$messages" },
			{ $sort: { "messages.createdAt": -1 } },
			{ $group: { _id: "$_id", messages: { $push: "$messages" } } },
		]);

		if (!getMessages || getMessages.length === 0)
			return apiError("You have no message yet !", false, 404);

		return apiResponse(
			"Get message successfully !!",
			true,
			200,
			getMessages[0].messages
		);
	} catch (err: any) {
		return apiError("Faild to get messages", false, 400);
	}
};
