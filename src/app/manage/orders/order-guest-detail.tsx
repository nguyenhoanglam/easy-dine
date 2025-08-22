import Image from "next/image";
import { Fragment } from "react";

import { Button } from "@/components";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/lib/constants";
import {
  formatCurrency,
  formatDate,
  getVietnameseOrderStatus,
  OrderStatusIcon,
  showResponseError,
} from "@/lib/utils";
import { usePayGuestOrdersMutation } from "@/queries/order";
import { Guest } from "@/types/guest";
import { Order, PayGuestOrdersResData } from "@/types/order";

type Props = {
  guest: Guest;
  orders: Order[];
  onPaymentSuccess?: (data: PayGuestOrdersResData) => void;
};

export default function OrderGuestDetail({
  guest,
  orders,
  onPaymentSuccess,
}: Props) {
  const payGuestOrdersMutation = usePayGuestOrdersMutation();

  const notPaidOrders = guest
    ? orders.filter(
        (order) =>
          order.status !== OrderStatus.Paid &&
          order.status !== OrderStatus.Rejected,
      )
    : [];

  const paidOrders = guest
    ? orders.filter((order) => order.status === OrderStatus.Paid)
    : [];

  const pay = async () => {
    if (payGuestOrdersMutation.isPending) {
      return;
    }

    const response = await payGuestOrdersMutation.mutateAsync({
      guestId: guest.id,
    });

    if (!response.ok) {
      showResponseError(response);
      return;
    }

    onPaymentSuccess?.(response.data);
  };

  return (
    <div className="space-y-2 text-sm">
      {guest && (
        <Fragment>
          <div className="space-x-1">
            <span className="font-semibold">Tên:</span>
            <span>{guest.name}</span>
            <span className="font-semibold">(#{guest.id})</span>
            <span>|</span>
            <span className="font-semibold">Bàn:</span>
            <span>{guest.tableNumber}</span>
          </div>
          <div className="space-x-1">
            <span className="font-semibold">Ngày đăng ký:</span>
            <span>{formatDate(guest.createdAt)}</span>
          </div>
        </Fragment>
      )}

      <div className="space-y-1">
        <div className="font-semibold">Đơn hàng:</div>
        {orders.map((order, index) => {
          return (
            <div key={order.id} className="flex gap-2 items-center text-xs">
              <span className="w-[10px]">{index + 1}</span>
              <span title={getVietnameseOrderStatus(order.status)}>
                {order.status === OrderStatus.Pending && (
                  <OrderStatusIcon.Pending className="w-4 h-4" />
                )}
                {order.status === OrderStatus.Processing && (
                  <OrderStatusIcon.Processing className="w-4 h-4" />
                )}
                {order.status === OrderStatus.Rejected && (
                  <OrderStatusIcon.Rejected className="w-4 h-4 text-red-400" />
                )}
                {order.status === OrderStatus.Delivered && (
                  <OrderStatusIcon.Delivered className="w-4 h-4" />
                )}
                {order.status === OrderStatus.Paid && (
                  <OrderStatusIcon.Paid className="w-4 h-4 text-yellow-400" />
                )}
              </span>
              <Image
                src={order.dishSnapshot.image}
                alt={order.dishSnapshot.name}
                title={order.dishSnapshot.name}
                width={30}
                height={30}
                className="h-[30px] w-[30px] rounded object-cover"
              />
              <span
                className="truncate w-[70px] sm:w-[100px]"
                title={order.dishSnapshot.name}
              >
                {order.dishSnapshot.name}
              </span>
              <span className="font-semibold" title={`Tổng: ${order.quantity}`}>
                x{order.quantity}
              </span>
              <span className="italic">
                {formatCurrency(order.quantity * order.dishSnapshot.price)}
              </span>
              <span
                className="hidden sm:inline"
                title={`Tạo: ${formatDate(
                  order.createdAt,
                )} | Cập nhật: ${formatDate(order.updatedAt)}
          `}
              >
                {formatDate(order.createdAt)}
              </span>
              <span
                className="sm:hidden"
                title={`Tạo: ${formatDate(
                  order.createdAt,
                )} | Cập nhật: ${formatDate(order.updatedAt)}
          `}
              >
                {formatDate(order.createdAt)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="space-x-1">
        <span className="font-semibold">Chưa thanh toán:</span>
        <Badge>
          <span>
            {formatCurrency(
              notPaidOrders.reduce((acc, order) => {
                return acc + order.quantity * order.dishSnapshot.price;
              }, 0),
            )}
          </span>
        </Badge>
      </div>
      <div className="space-x-1">
        <span className="font-semibold">Đã thanh toán:</span>
        <Badge variant={"outline"}>
          <span>
            {formatCurrency(
              paidOrders.reduce((acc, order) => {
                return acc + order.quantity * order.dishSnapshot.price;
              }, 0),
            )}
          </span>
        </Badge>
      </div>

      <div>
        <Button
          className="w-full "
          size={"sm"}
          disabled={notPaidOrders.length === 0}
          loading={payGuestOrdersMutation.isPending}
          onClick={pay}
        >
          Thanh toán tất cả ({notPaidOrders.length} đơn)
        </Button>
      </div>
    </div>
  );
}
