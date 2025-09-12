"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import Quantity from "@/app/[locale]/guest/menu/quantity";
import GuestsDialog from "@/app/[locale]/manage/orders/guests-dialog";
import { TablesDialog } from "@/app/[locale]/manage/orders/tables-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DishStatus } from "@/lib/constants";
import {
  cn,
  formatCurrency,
  getTableQueryResult,
  showResponseError,
} from "@/lib/utils";
import { useCreateGuestAccountMutation } from "@/queries/account";
import { useDishListQuery } from "@/queries/dish";
import { useCreateOrdersMutation } from "@/queries/order";
import { guestLoginSchema } from "@/schemas/guest";
import { GetGuestListResData } from "@/types/account";
import { GuestLoginReqBody } from "@/types/guest";
import { CreateOrderReqBody } from "@/types/order";

export default function AddOrder() {
  const [open, setOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] =
    useState<GetGuestListResData[number]>();
  const [isNewGuest, setIsNewGuest] = useState(true);
  const [orders, setOrders] = useState<CreateOrderReqBody["orders"]>([]);

  const createGuestMutation = useCreateGuestAccountMutation();
  const createOrdersMutation = useCreateOrdersMutation();
  const dishListQuery = useDishListQuery();
  const { data: dishes } = getTableQueryResult(dishListQuery);

  const form = useForm<GuestLoginReqBody>({
    resolver: zodResolver(guestLoginSchema),
    defaultValues: {
      name: "",
      tableNumber: 0,
    },
  });

  const name = form.watch("name");
  const tableNumber = form.watch("tableNumber");

  const totalPrice = useMemo(() => {
    if (!dishes) return 0;

    return dishes.reduce((total, dish) => {
      const order = orders.find((order) => order.dishId === dish.id);
      return order ? total + order.quantity * dish.price : total;
    }, 0);
  }, [dishes, orders]);

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prev) => {
      if (quantity === 0) {
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

  const reset = () => {
    setSelectedGuest(undefined);
    setIsNewGuest(true);
    setOrders([]);
    form.reset();
  };

  const handleOrder = async () => {
    let guestId = selectedGuest?.id;

    if (isNewGuest) {
      const createGuestResponse = await createGuestMutation.mutateAsync({
        name,
        tableNumber,
      });

      if (!createGuestResponse.ok) {
        showResponseError(createGuestResponse);
        return;
      }

      guestId = createGuestResponse.data.id;
    }

    if (!guestId) {
      toast.error("Vui lòng chọn khách hàng hoặc tạo khách hàng mới.", {
        richColors: true,
      });
      return;
    }

    const response = await createOrdersMutation.mutateAsync({
      guestId,
      orders,
    });

    if (!response.ok) {
      showResponseError(response);
      return;
    }

    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          reset();
        }

        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Tạo đơn hàng
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Tạo đơn hàng</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
          <Label htmlFor="isNewGuest">Khách hàng mới</Label>
          <div className="col-span-3 flex items-center">
            <Switch
              id="isNewGuest"
              checked={isNewGuest}
              onCheckedChange={setIsNewGuest}
            />
          </div>
        </div>
        {isNewGuest && (
          <Form {...form}>
            <form
              noValidate
              className="grid auto-rows-max items-start gap-4 md:gap-8"
              id="add-employee-form"
            >
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="name">Tên khách hàng</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input id="name" className="w-full" {...field} />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tableNumber"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="tableNumber">Chọn bàn</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <div className="flex items-center gap-4">
                            <div>{field.value}</div>
                            <TablesDialog
                              onTableSelect={(table) => {
                                field.onChange(table.number);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        )}
        {!isNewGuest && <GuestsDialog onGuestSelect={setSelectedGuest} />}
        {!isNewGuest && selectedGuest && (
          <div className="grid grid-cols-4 items-center justify-items-start gap-4">
            <Label htmlFor="selectedGuest">Khách đã chọn</Label>
            <div className="col-span-3 w-full gap-4 flex items-center">
              <div>
                {selectedGuest.name} (#{selectedGuest.id})
              </div>
              <div>Bàn: {selectedGuest.tableNumber}</div>
            </div>
          </div>
        )}
        {dishes
          .filter((dish) => dish.status !== DishStatus.Hidden)
          .map(({ id, status, name, image, description, price }) => (
            <div
              key={id}
              className={cn("flex gap-4", {
                "pointer-events-none": status === DishStatus.Unavailable,
              })}
            >
              <div className="flex-shrink-0 relative">
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
                  onChange={(value) => handleQuantityChange(id, value)}
                  value={
                    orders.find((order) => order.dishId === id)?.quantity ?? 0
                  }
                />
              </div>
            </div>
          ))}
        <DialogFooter>
          <Button
            className="w-full flex justify-between gap-1 text-sm"
            onClick={handleOrder}
            disabled={orders.length === 0}
          >
            <span>Đặt hàng ({orders.length} món)</span>
            <span className="font-black">{formatCurrency(totalPrice)}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
