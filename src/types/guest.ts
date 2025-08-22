import z from "zod";

import { Role } from "@/lib/constants";
import { guestCreateOrdersSchema, guestLoginSchema } from "@/schemas/guest";
import { Order } from "@/types/order";

export type Guest = {
  id: number;
  name: string;
  role: typeof Role.Guest;
  tableNumber: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type GuestLoginReqBody = z.infer<typeof guestLoginSchema>;

export type GuestLoginResData = {
  accessToken: string;
  refreshToken: string;
  guest: Guest;
};

export type GuestLogoutReqBody = {
  refreshToken: string;
};

export type GuestRefreshTokenReqBody = {
  refreshToken: string;
};

export type GuestRefreshTokenResData = {
  accessToken: string;
  refreshToken: string;
};

export type GuestGetOrderListResData = Order[];

export type GuestCreateOrdersReqBody = z.infer<typeof guestCreateOrdersSchema>;

export type GuestCreateOrdersResData = Order[];
