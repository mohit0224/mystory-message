import { z } from "zod";

const loginValidationSchema = z.object({
	identifier: z.string().min(2,'Username / Email must be atleast 2 characters'),
	password: z.string(),
});

export default loginValidationSchema;
