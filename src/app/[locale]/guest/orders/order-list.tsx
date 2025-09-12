"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

import { Button } from "@/components";
import { useAppStore } from "@/components/app-provider";
import { Badge } from "@/components/ui/badge";
import { OrderStatus, SocketEvent } from "@/lib/constants";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestOrderListQuery } from "@/queries/guest";
import { PayGuestOrdersResData, UpdateOrderResData } from "@/types/order";

type Data = {
  count: number;
  totalPrice: number;
};

type Summary = {
  unpaid: Data;
  paid: Data;
};

const INITIAL_SUMMARY: Summary = {
  unpaid: { count: 0, totalPrice: 0 },
  paid: { count: 0, totalPrice: 0 },
};

export default function OrderList() {
  const { socket } = useAppStore();
  const { data, refetch } = useGuestOrderListQuery();
  const orders = data?.ok ? data.data : null;

  const summary = useMemo<Summary>(() => {
    if (orders) {
      return orders.reduce((summary, order) => {
        if (
          order.status === OrderStatus.Processing ||
          order.status === OrderStatus.Delivered ||
          order.status === OrderStatus.Pending
        ) {
          return {
            ...summary,
            unpaid: {
              count: summary.unpaid.count + 1,
              totalPrice:
                summary.unpaid.totalPrice +
                order.dishSnapshot.price * order.quantity,
            },
          };
        }

        if (order.status === OrderStatus.Paid) {
          return {
            ...summary,
            paid: {
              count: summary.paid.count + 1,
              totalPrice:
                summary.paid.totalPrice +
                order.dishSnapshot.price * order.quantity,
            },
          };
        }

        return summary;
      }, INITIAL_SUMMARY);
    }

    return INITIAL_SUMMARY;
  }, [orders]);

  useEffect(() => {
    function onConnect() {
      console.log("Socket connected:", socket?.id);
    }

    function onDisconnect() {
      console.log("Socket disconnected");
    }

    function onOrderUpdate(data: UpdateOrderResData) {
      const {
        dishSnapshot: { name },
        quantity,
        status,
      } = data;
      toast.info(
        `Món ${name} (x${quantity}) vừa được cập nhật sang trạng thái ${getVietnameseOrderStatus(status)}`,
        { richColors: true },
      );

      refetch();
    }

    function onPayment(data: PayGuestOrdersResData) {
      toast.success(`Bạn đã thanh toán ${data.length} đơn.`, {
        richColors: true,
      });

      refetch();
    }

    if (socket?.connected) {
      onConnect();
    }

    socket?.on(SocketEvent.Connect, onConnect);
    socket?.on(SocketEvent.Disconnect, onDisconnect);
    socket?.on(SocketEvent.UpdateOrder, onOrderUpdate);
    socket?.on(SocketEvent.Payment, onPayment);

    return () => {
      socket?.off(SocketEvent.Connect, onConnect);
      socket?.off(SocketEvent.Disconnect, onDisconnect);
      socket?.off(SocketEvent.UpdateOrder, onOrderUpdate);
      socket?.off(SocketEvent.Payment, onPayment);
    };
  }, [refetch, socket]);

  if (!orders) {
    return <div className="text-center">Loading</div>;
  }

  return (
    <>
      {orders.map(
        (
          { id, quantity, status, dishSnapshot: { name, image, price } },
          index,
        ) => (
          <div key={id} className="flex gap-4">
            <div className="text-sm font-semibold">{index}</div>
            <div className="relative flex-shrink-0">
              <Image
                src={image}
                alt={name}
                height={100}
                width={100}
                quality={100}
                className="object-cover w-[80px] h-[80px] rounded-md"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm">{name}</h3>
              <p className="text-xs font-semibold">
                {formatCurrency(price)} x {quantity}
              </p>
            </div>
            <div className="flex-shrink-0 ml-auto flex justify-center items-center">
              <Badge variant="outline">
                {getVietnameseOrderStatus(status)}
              </Badge>
            </div>
          </div>
        ),
      )}
      {summary.paid.totalPrice > 0 && (
        <div className="sticky bottom-0">
          <Button className="w-full flex justify-between gap-1 text-sm bg-green-700">
            <span>Đã thanh toán ({summary.paid.count} món)</span>
            <span className="font-black">
              {formatCurrency(summary.paid.totalPrice)}
            </span>
          </Button>
        </div>
      )}
      {summary.unpaid.totalPrice > 0 && (
        <div className="sticky bottom-0">
          <Button className="w-full flex justify-between gap-1 text-sm">
            <span>Chưa thanh toán ({summary.unpaid.count} món)</span>
            <span className="font-black">
              {formatCurrency(summary.unpaid.totalPrice)}
            </span>
          </Button>
        </div>
      )}
    </>
  );
}
