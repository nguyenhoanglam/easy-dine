import z from "zod";

import {
  accountSchema,
  changePasswordSchema,
  updateProfileSchema,
} from "@/schemas/account";

export type Account = z.infer<typeof accountSchema>;

export type GetProfileResData = Account;

export type UpdateProfileReqBody = z.infer<typeof updateProfileSchema>;

export type UpdateProfileResData = Account;

export type ChangePasswordReqBody = z.infer<typeof changePasswordSchema>;

export type ChangePasswordResData = {
  accessToken: string;
  refreshToken: string;
  account: Account;
};
