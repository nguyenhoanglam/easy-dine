import z from "zod";

import { OrderStatusValues } from "@/lib/constants";

export const createGuestOrdersSchema = z
  .object({
    guestId: z.number(),
    orders: z.array(
      z.object({
        dishId: z.number(),
        quantity: z.number(),
      }),
    ),
  })
  .strict();

export const updateGuestOrderSchema = z.object({
  status: z.enum(OrderStatusValues),
  dishId: z.number(),
  quantity: z.number(),
});

export const payGuestOrdersSchema = z.object({
  guestId: z.number(),
});
