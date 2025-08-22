import z from "zod";

import { OrderStatus } from "@/lib/constants";
import {
  createOrdersSchema,
  getOrderListQueryParamsSchema,
  updateOrderSchema,
} from "@/schemas/order";
import { Account } from "@/types/account";
import { DishSnapshot } from "@/types/dish";
import { Guest } from "@/types/guest";
import { Table } from "@/types/table";

export type Order = {
  id: number;
  guestId: number | null;
  guest: Guest | null;
  tableNumber: number | null;
  dishSnapshotId: number;
  dishSnapshot: DishSnapshot;
  quantity: number;
  orderHandlerId: number | null;
  orderHandler: Account | null;
  status: (typeof OrderStatus)[keyof typeof OrderStatus];
  createdAt: Date;
  updatedAt: Date;
};

export type GetOrderListQueryParams = z.infer<
  typeof getOrderListQueryParamsSchema
>;

export type GetOrderListResData = Order[];

export type GetOrderDetailResData = Order & { table: Table };

export type CreateOrderReqBody = z.infer<typeof createOrdersSchema>;

export type CreateOrderResData = Order[];

export type UpdateOrderReqBody = z.infer<typeof updateOrderSchema>;

export type UpdateOrderResData = Order;

export type PayGuestOrdersReqBody = {
  guestId: number;
};

export type PayGuestOrdersResData = Order[];
