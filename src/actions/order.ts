"use server";

import { httpClient } from "@/lib/http";
import {
  GetOrderListResData,
  UpdateOrderReqBody,
  UpdateOrderResData,
} from "@/types/order";

const basePath = "/orders";

export async function gestOrderListAction() {
  return httpClient.get<GetOrderListResData>(basePath);
}

export async function updateOrderAction(
  orderId: number,
  body: UpdateOrderReqBody,
) {
  return httpClient.put<UpdateOrderResData>(`${basePath}/${orderId}`, body);
}
