import z from "zod";

import { loginRequestSchema, registerRequestSchema } from "@/schemas/auth";

import { Account } from "./account";

export type LoginReqBody = z.infer<typeof loginRequestSchema>;

export type LoginResData = {
  accessToken: string;
  refreshToken: string;
  account: Account;
};

export type LogoutReqBody = {
  refreshToken: string;
};

export type RegisterReqBody = z.infer<typeof registerRequestSchema>;

export type RegisterResData = LoginResData;

export type RefreshTokenReqBody = {
  refreshToken: string;
};

export type RefreshTokenResData = {
  accessToken: string;
  refreshToken: string;
};

export type SlideSessionResData = LoginResData;
