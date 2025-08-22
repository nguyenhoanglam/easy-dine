import { useMemo } from "react";

import {
  OrdersByGuestId,
  ServingGuestByTableNumber,
  Statistics,
} from "@/app/manage/orders/order-table";
import { OrderStatus } from "@/lib/constants";
import { Order } from "@/types/order";

export function useOrdersStatistics(orderList: Order[]) {
  const result = useMemo(() => {
    const statistics: Statistics = {
      status: {
        Pending: 0,
        Processing: 0,
        Delivered: 0,
        Paid: 0,
        Rejected: 0,
      },
      table: {},
    };
    const ordersByGuestId: OrdersByGuestId = {};
    const guestByTableNumber: ServingGuestByTableNumber = {};

    orderList.forEach((order) => {
      statistics.status[order.status] = statistics.status[order.status] + 1;
      // Nếu table và guest chưa bị xóa
      if (order.tableNumber !== null && order.guestId !== null) {
        if (!statistics.table[order.tableNumber]) {
          statistics.table[order.tableNumber] = {};
        }

        const table = statistics.table[order.tableNumber];
        table[order.guestId] = {
          ...table[order.guestId],
          [order.status]: (table[order.guestId]?.[order.status] ?? 0) + 1,
        };
      }

      // guestIdToOrdersMap
      if (order.guestId) {
        if (!ordersByGuestId[order.guestId]) {
          ordersByGuestId[order.guestId] = [];
        }

        ordersByGuestId[order.guestId].push(order);
      }

      // Tính toán cho guestByTableNumber
      if (order.tableNumber && order.guestId) {
        if (!guestByTableNumber[order.tableNumber]) {
          guestByTableNumber[order.tableNumber] = {};
        }
        guestByTableNumber[order.tableNumber][order.guestId] =
          ordersByGuestId[order.guestId];
      }
    });

    // Cần phải lọc lại 1 lần nữa mới chuẩn
    // Những guest nào mà không còn phục vụ nữa sẽ bị loại bỏ
    const servingGuestByTableNumber: ServingGuestByTableNumber = {};
    for (const tableNumber in guestByTableNumber) {
      const guestObject = guestByTableNumber[tableNumber];
      const servingGuestObject: OrdersByGuestId = {};

      for (const guestId in guestObject) {
        const guestOrders = guestObject[guestId];
        const isServingGuest = guestOrders.some(
          (order) =>
            OrderStatus.Pending === order.status ||
            OrderStatus.Processing === order.status ||
            OrderStatus.Delivered === order.status,
        );

        if (isServingGuest) {
          servingGuestObject[Number(guestId)] = guestOrders;
        }
      }

      if (Object.keys(servingGuestObject).length) {
        servingGuestByTableNumber[Number(tableNumber)] = servingGuestObject;
      }
    }

    return {
      statistics,
      ordersByGuestId,
      servingGuestByTableNumber,
    };
  }, [orderList]);

  return result;
}
