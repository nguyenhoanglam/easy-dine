import z from "zod";

export const registerPasswordSchema = z.string().min(6, {
  error: "Mật khẩu có ít nhất 6 ký tự",
});

export const loginPasswordSchema = z.string().min(6, {
  error: "Mật khẩu có ít nhất 6 ký tự",
});

export const confirmPasswordSchema = z.string().min(1, {
  error: "Mật khẩu xác nhận không được để trống",
});

export const registerRequestSchema = z
  .object({
    name: z.string().trim().min(2).max(256),
    email: z.email(),
    password: registerPasswordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .strict()
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    error: "Mật khẩu xác nhận không đúng.",
    path: ["confirmPassword"],
  });

export const loginRequestSchema = z
  .object({
    email: z.email(),
    password: loginPasswordSchema,
  })
  .strict();
