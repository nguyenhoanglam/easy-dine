import z from "zod";

export const uploadImageSchema = z.object({
  data: z.string(),
  message: z.string(),
});
