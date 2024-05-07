import { NextRequest } from "next/server";
import apiResponse from "@/helper/apiResponse";
import apiError from "@/helper/apiError";
import dbConnect from "@/database/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import User from "@/models/user.model";
import { User as nextAuthUser } from "next-auth";

export const POST = async (req: NextRequest) => {
	await dbConnect();
	const session = await getServerSession(authOptions);
	const user = session?.user;

	if (!session || !session.user)
		return apiError("Not authenticated !!", false, 400);

	const userID = user._id;
	const { acceptMessage } = await req.json();

	try {
		const updateUser = await User.findByIdAndUpdate(
			userID,
			{
				isAcceptingMessages: acceptMessage,
			},
			{ new: true }
		);

		if (!updateUser)
			return apiError(
				"Faild to update user status to accept messages !!",
				false,
				401
			);

		return apiResponse(
			"Message acceptance status changed successfully !!",
			true,
			200
		);
	} catch (err: any) {
		console.log("faild to update user status to accept message");
		return apiError(err.message, false, 400);
	}
};

export const GET = async (req: NextRequest) => {
	await dbConnect();
	const session = await getServerSession(authOptions);
	const user = session?.user;

	if (!session || !session.user)
		return apiError("Not authenticated !!", false, 400);

	const userID = user._id;

	try {
		const getUser = await User.findById(userID);

		if (!getUser) return apiError("User not found", false, 404);

		return apiResponse(
			"User recieved messages !!",
			true,
			200,
			getUser?.isAcceptingMessages
		);
	} catch (err: any) {
		console.log("user not received messages !!");
		return apiError(err.message, false, 400);
	}
};
