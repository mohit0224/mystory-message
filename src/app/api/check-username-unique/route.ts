import dbConnect from "@/database/dbConnect";
import { NextRequest } from "next/server";
import apiError from "@/helper/apiError";
import apiResponse from "@/helper/apiResponse";
import { z } from "zod";
import { usernameValidation } from "@/validationSchema/signupValidationSchema";
import User from "@/models/user.model";

const usernameQuerySchema = z.object({
	username: usernameValidation,
});

export const GET = async (req: NextRequest) => {
	await dbConnect();
	try {
		const { searchParams } = new URL(req.url);
		const queryParams = { username: searchParams.get("username") };

		const check = usernameQuerySchema.safeParse(queryParams);
		if (!check.success) {
			const userError = check.error.format().username?._errors || [];
			return apiResponse(
				userError.length > 0 ? userError.join(", ") : "Invalid query params",
				false,
				400
			);
		}

		const { username } = check.data;
		const existingVerifiedUser = await User.findOne({
			username,
			isVerified: true,
		});

		if (existingVerifiedUser) throw new Error("Username is already taken !!");

		return apiResponse("Username is unique !!", true, 200);
	} catch (err: any) {
		return apiError(err.message, false, 400);
	}
};
