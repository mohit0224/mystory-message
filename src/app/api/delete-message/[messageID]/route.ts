import apiResponse from "@/helper/apiResponse";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import apiError from "@/helper/apiError";
import User from "@/models/user.model";
import dbConnect from "@/database/dbConnect";

export const DELETE = async (
	req: NextRequest,
	{ params }: { params: { messageID: string } }
) => {
	dbConnect();

	try {
		const { messageID } = params;
		const session = await getServerSession(authOptions);
		const user = session?.user;
		if (!session || !user) return apiError("not authenticated !!", false, 400);

		const updateResult = await User.updateOne(
			{ _id: user._id },
			{ $pull: { messages: { _id: messageID } } }
		);

		if (updateResult.modifiedCount === 0)
			return apiError("Message not found or deleted !!", false, 404);

		return apiResponse("Message deleted !!", true, 200);
	} catch (err: any) {
		return apiError("Error deleting message !!", false, 404);
	}
};
