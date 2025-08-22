"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import Quantity from "@/app/guest/menu/quantity";
import { Button } from "@/components/ui/button";
import { DishStatus } from "@/lib/constants";
import { cn, formatCurrency, showResponseError } from "@/lib/utils";
import { useDishListQuery } from "@/queries/dish";
import { useGuestCreateOrdersMutation } from "@/queries/guest";
import { GuestCreateOrdersReqBody } from "@/types/guest";

export default function MenuOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<GuestCreateOrdersReqBody>([]);

  const guestCreateOrdersMutation = useGuestCreateOrdersMutation();
  const { data } = useDishListQuery();
  const dishes = data?.ok
    ? data.data.filter((dish) => dish.status !== DishStatus.Hidden)
    : null;

  const totalPrice = useMemo(() => {
    if (dishes) {
      return orders.reduce((total, order) => {
        const dish = dishes.find((dish) => dish.id === order.dishId);
        if (!dish) return total;

        return total + dish.price * order.quantity;
      }, 0);
    }

    return 0;
  }, [dishes, orders]);

  if (!dishes) {
    return <div className="text-center">Loading</div>;
  }

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prev) => {
      if (quantity <= 0) {
        return prev.filter((order) => order.dishId !== dishId);
      }

      const index = prev.findIndex((order) => order.dishId === dishId);
      if (index === -1) {
        return [...prev, { dishId, quantity }];
      }

      return prev.map((order, i) =>
        i === index ? { ...order, quantity } : order,
      );
    });
  };

  const handleOrder = async () => {
    const response = await guestCreateOrdersMutation.mutateAsync(orders);

    if (!response.ok) {
      showResponseError(response);
      return;
    }

    router.push("/guest/orders");
  };

  return (
    <>
      {dishes.map(({ status, name, image, description, price, id }) => (
        <div
          key={id}
          className={cn("flex gap-4", {
            "pointer-events-none": status === DishStatus.Unavailable,
          })}
        >
          <div className="relative flex-shrink-0">
            {status === DishStatus.Unavailable && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm">
                Hết hàng
              </span>
            )}
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
            <p className="text-xs">{description}</p>
            <p className="text-xs font-semibold">{formatCurrency(price)}</p>
          </div>
          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <Quantity
              value={orders.find((order) => order.dishId === id)?.quantity ?? 0}
              onChange={(value) => handleQuantityChange(id, value)}
            />
          </div>
        </div>
      ))}
      <div className="sticky bottom-0">
        <Button
          className="w-full justify-between cursor-pointer"
          onClick={handleOrder}
          disabled={orders.length === 0}
        >
          <span>Đặt hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  );
}
