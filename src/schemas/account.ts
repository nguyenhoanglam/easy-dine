import z from "zod";

import { Role } from "@/lib/constants";
import {
  accoutnNameSchema,
  avatarSchema,
  confirmPasswordSchema,
  emailSchema,
  passwordSchema,
} from "@/schemas/common";
import { tableNumberSchema } from "@/schemas/table";

const roleSchema = z.enum([Role.Employee, Role.Owner]);

export const accountSchema = z.object({
  id: z.number(),
  name: accoutnNameSchema,
  email: emailSchema,
  avatar: avatarSchema,
  role: roleSchema,
});

export const updateProfileSchema = z
  .object({
    name: accoutnNameSchema,
    avatar: avatarSchema,
  })
  .strict();

export const changePasswordSchema = z
  .object({
    oldPassword: passwordSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
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
    name: accoutnNameSchema,
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
    name: accoutnNameSchema,
    email: emailSchema,
    avatar: avatarSchema,
    changePassword: z.boolean().optional(),
    password: passwordSchema.optional(),
    confirmPassword: confirmPasswordSchema.optional(),
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

export const createGuestAccountSchema = z.object({
  name: accoutnNameSchema,
  tableNumber: tableNumberSchema,
});
