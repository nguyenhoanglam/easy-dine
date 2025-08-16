import z from "zod";

import { OrderStatusValues } from "@/lib/constants";
import { payGuestOrdersSchema, updateGuestOrderSchema } from "@/schemas/order";
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
  status: typeof OrderStatusValues;
  createdAt: Date;
  updatedAt: Date;
};

export type GetOrderListResData = Order[];

export type GetOrderDetailResData = Order & { table: Table };

export type UpdateOrderReqBody = z.infer<typeof updateGuestOrderSchema>;

export type UpdateOrderResData = Order;

export type PayGuestOrdersReqBody = z.infer<typeof payGuestOrdersSchema>;
