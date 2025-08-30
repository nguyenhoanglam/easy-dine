"use server";

import { httpClient } from "@/lib/http";
import { createQueryString } from "@/lib/utils";
import { GuestCreateOrdersResData } from "@/types/guest";
import {
  CreateOrderReqBody,
  GetOrderDetailResData,
  GetOrderListQueryParams,
  GetOrderListResData,
  PayGuestOrdersReqBody,
  PayGuestOrdersResData,
  UpdateOrderReqBody,
  UpdateOrderResData,
} from "@/types/order";

const basePath = "/orders";

const Tags = {
  Orders: "orders",
};

export async function getOrderListAction(params: GetOrderListQueryParams) {
  const queryString = createQueryString({
    fromDate: params.fromDate?.toISOString(),
    toDate: params.toDate?.toISOString(),
  });

  return httpClient.get<GetOrderListResData>(`${basePath}${queryString}`, {
    next: { tags: [Tags.Orders] },
  });
}

export async function getOrderDetailAction(orderId: number) {
  return httpClient.get<GetOrderDetailResData>(`${basePath}/${orderId}`);
}

export async function createOrdersAction(body: CreateOrderReqBody) {
  return httpClient.post<GuestCreateOrdersResData>(basePath, body);
}

export async function updateOrderAction(
  orderId: number,
  body: UpdateOrderReqBody,
) {
  return httpClient.put<UpdateOrderResData>(`${basePath}/${orderId}`, body);
}

export async function payGuestOrdersAction(body: PayGuestOrdersReqBody) {
  return httpClient.post<PayGuestOrdersResData>(`${basePath}/pay`, body);
}
