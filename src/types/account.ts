import z from "zod";

import {
  accountSchema,
  changePasswordSchema,
  createEmployeeAccountSchema,
  updateEmployeeAccountSchema,
  updateProfileSchema,
} from "@/schemas/account";

export type Account = z.infer<typeof accountSchema>;

export type UpdateProfileReqBody = z.infer<typeof updateProfileSchema>;

export type ChangePasswordReqBody = z.infer<typeof changePasswordSchema>;

export type ChangePasswordResData = {
  accessToken: string;
  refreshToken: string;
  account: Account;
};

export type CreateEmployeeAccountReqBody = z.infer<
  typeof createEmployeeAccountSchema
>;

export type UpdateEmployeeAccountReqBody = z.infer<
  typeof updateEmployeeAccountSchema
>;
