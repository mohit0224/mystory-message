import { NextRequest } from "next/server";
import dbConnect from "@/database/dbConnect";
import apiError from "@/helper/apiError";
import apiResponse from "@/helper/apiResponse";
import User from "@/models/user.model";
import { z } from "zod";
import verifyValidationSchema from "@/validationSchema/verifyValidationSchema";

export const POST = async (req: NextRequest) => {
	await dbConnect();
	try {
		const { username, code } = await req.json();
		const decodedUsername = decodeURIComponent(username);

		const user = await User.findOne({ username: decodedUsername });
		if (!user) throw new Error("User not found !!");

		const checkCode = user.verifyCode === code;
		if (!checkCode) throw new Error("Invalid verifiation code !!");

		const checkCodeNoExpiry = new Date(user.verifyCodeExpiry) > new Date();
		if (!checkCodeNoExpiry)
			throw new Error(
				"Invalid verifiation. Otp has been expired, signup again to get a new varification code"
			);

		if (checkCode && checkCodeNoExpiry) {
			user.isVerified = true;
			await user.save();

			return apiResponse("User verified successfully !!", true, 200);
		}
	} catch (err: any) {
		return apiError(err.message, false, 400);
	}
};
