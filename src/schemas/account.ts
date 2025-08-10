import z from "zod";

import { Role } from "@/lib/constants";

export const nameSchema = z
  .string()
  .trim()
  .min(2, { error: "Tên tài khoản phải có ít nhất 2 ký tự." })
  .max(256, { error: "Tên tài khoản không được quá 256 ký tự." });

const avatarSchema = z.string().nullable();

const emailSchema = z.email({
  error: "Email không hợp lệ.",
});

const passwordSchema = z
  .string()
  .min(6, { error: "Mật khẩu phải có ít nhất 6 ký tự." })
  .max(100, { error: "Mật khẩu không được quá 100 ký tự." });

const roleSchema = z.enum([Role.Employee, Role.Owner]);

export const accountSchema = z.object({
  id: z.number(),
  name: nameSchema,
  email: emailSchema,
  role: roleSchema,
  avatar: avatarSchema,
});

export const updateProfileSchema = z
  .object({
    name: nameSchema,
    avatar: avatarSchema,
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

export const createEmployeeAccountSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    avatar: avatarSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
      });
    }
  });

export const updateEmployeeAccountSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    avatar: avatarSchema,
    changePassword: z.boolean().optional(),
    password: passwordSchema.optional(),
    confirmPassword: passwordSchema.optional(),
    role: roleSchema.optional(),
  })
  .strict()
  .superRefine(({ changePassword, password, confirmPassword }, ctx) => {
    if (changePassword) {
      if (!password && !confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Hãy nhập mật khẩu mới.",
          path: ["password"],
        });

        ctx.addIssue({
          code: "custom",
          message: "Hãy nhập mật khẩu xác nhận.",
          path: ["confirmPassword"],
        });
      } else if (!password) {
        ctx.addIssue({
          code: "custom",
          message: "Hãy nhập mật khẩu mới.",
          path: ["password"],
        });
      } else if (!confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Hãy nhập mật khẩu xác nhận.",
          path: ["confirmPassword"],
        });
      } else if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "Mật khẩu xác nhận không khớp.",
          path: ["confirmPassword"],
        });
      }
    }
  });
