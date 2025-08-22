import z from "zod";

import { OrderStatusValues } from "@/lib/constants";

export const getOrderListQueryParamsSchema = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
});

export const createOrdersSchema = z
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

export const updateOrderSchema = z.object({
  dishId: z.number(),
  quantity: z.number(),
  status: z.enum(OrderStatusValues),
});
