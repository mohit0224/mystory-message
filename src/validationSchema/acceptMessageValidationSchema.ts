import { z } from "zod";

const acceptMessageValidationSchema = z.object({
	acceptMessages: z.boolean(),
});

export default acceptMessageValidationSchema;
