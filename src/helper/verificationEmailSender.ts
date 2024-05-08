import resend from "@/lib/resend";
import VerificationEmail from "@/components/email-templetes/VerificationEmail";

export const verificationEmailSender = async (
	username: string,
	email: string,
	verificationCode: string
) => {
	try {
		const response = await resend.emails.send({
			from: "verificationcode@mohitdheer.shop",
			to: email,
			subject: "Mystry message | Verification code",
			react: VerificationEmail({ username, otp: verificationCode }),
		});
		return response;
	} catch (err: any) {
		console.log(`Failed to send verification email ${err.message}`);
		throw new Error(err.message);
	}
};
