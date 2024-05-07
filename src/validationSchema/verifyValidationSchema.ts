import { z } from "zod";

const verifyValidationSchema = z.object({
	verifyCode: z
		.string()
		.min(6, { message: "Verification code must be 6 digits !!" })
		.max(6, { message: "Verification code must be no more than 6 digits !!" }),
});

export default verifyValidationSchema;
