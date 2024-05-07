import { z } from "zod";

const messageValidationSchema = z.object({
	content: z
		.string()
		.min(10, "Message must be atleast 10 chracters")
		.max(300, "Message must be no longer than 300 chracters"),
});

export default messageValidationSchema;
