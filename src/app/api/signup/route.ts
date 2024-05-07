import dbConnect from "@/database/dbConnect";
import apiError from "@/helper/apiError";
import apiResponse from "@/helper/apiResponse";
import User from "@/models/user.model";
import { NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import { verificationEmailSender } from "@/helper/verificationEmailSender";

export const POST = async (req: NextRequest) => {
	await dbConnect();
	try {
		const { username, email, password } = await req.json();

		// check if username exists
		const checkUserByUsername = await User.findOne({
			username,
			isVerified: true,
		});
		if (checkUserByUsername)
			throw new Error(`Username :: ${username} already exists !!`);

		// check if email exists
		const checkUserByEmail = await User.findOne({ email });

		// generate verify code / OTP
		const verificationCode = Math.floor(
			100000 + Math.random() * 900000
		).toString();

		let newUserCreated;

		if (checkUserByEmail) {
			if (checkUserByEmail.isVerified)
				throw new Error(`Email :: ${email} already exists !!`);
			else {
				const encryptedPassword = await bcryptjs.hash(password, 10);
				const expiryDate = new Date();
				expiryDate.setHours(expiryDate.getHours() + 1);

				checkUserByEmail.password = encryptedPassword;
				checkUserByEmail.verifyCode = verificationCode;
				checkUserByEmail.verifyCodeExpiry = expiryDate;

				newUserCreated = await checkUserByEmail.save();

				await verificationEmailSender(username, email, verificationCode);

				return apiResponse(
					"Verification code has been send successfully !!",
					true,
					200
				);
			}
		} else {
			const encryptedPassword = await bcryptjs.hash(password, 10);
			const expiryDate = new Date();
			expiryDate.setHours(expiryDate.getHours() + 1);

			newUserCreated = new User({
				username,
				email,
				password: encryptedPassword,
				verifyCode: verificationCode,
				verifyCodeExpiry: expiryDate,
				messages: [],
			});

			await newUserCreated.save();
		}

		await verificationEmailSender(username, email, verificationCode);

		return apiResponse("User registerd successfully !!", true, 200);
	} catch (err: any) {
		console.log(`Error registering :: ${err.message}`);
		return apiError(err.message, false, 500);
	}
};
