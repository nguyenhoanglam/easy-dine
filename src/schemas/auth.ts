import z from "zod";

import {
  accoutnNameSchema,
  confirmPasswordSchema,
  emailSchema,
  passwordSchema,
} from "@/schemas/common";

export const registerRequestSchema = z
  .object({
    name: accoutnNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .strict()
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    error: "Mật khẩu xác nhận không đúng.",
    path: ["confirmPassword"],
  });

export const loginRequestSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();
