import z from "zod";

import { Role } from "@/lib/constants";

export const nameSchema = z
  .string()
  .trim()
  .min(2, { error: "Tên tài khoản phải có ít nhất 2 ký tự." })
  .max(256, { error: "Tên tài khoản không được quá 256 ký tự." });

const emailSchema = z.email({
  error: "Email không hợp lệ.",
});

const passwordSchema = z
  .string()
  .min(6, { error: "Mật khẩu phải có ít nhất 6 ký tự." })
  .max(100, { error: "Mật khẩu không được quá 100 ký tự." });

export const accountSchema = z.object({
  id: z.number(),
  name: nameSchema,
  email: emailSchema,
  role: z.enum([Role.Employee, Role.Owner]),
  avatar: z.string().nullable(),
});

export const updateProfileSchema = z
  .object({
    name: nameSchema,
    avatar: z.url(),
  })
  .strict();

export const changePasswordSchema = z
  .object({
    oldPassword: passwordSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu xác nhận không đúng.",
        path: ["confirmPassword"],
      });
    }
  });
