import { Users } from "lucide-react";
import { Fragment, useState } from "react";

import OrderGuestDetail from "@/app/[locale]/manage/orders/order-guest-detail";
import {
  ServingGuestByTableNumber,
  Statistics,
  StatusCountObject,
} from "@/app/[locale]/manage/orders/order-table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OrderStatus, OrderStatusValues } from "@/lib/constants";
import { cn, getVietnameseOrderStatus, OrderStatusIcon } from "@/lib/utils";
import { Table } from "@/types/table";

// Ví dụ:
// const statics: Statics = {
//   status: {
//     Pending: 1,
//     Processing: 2,
//     Delivered: 3,
//     Paid: 5,
//     Rejected: 0
//   },
//   table: {
//     1: { // Bàn số 1
//       20: { // Guest 20
//         Pending: 1,
//         Processing: 2,
//         Delivered: 3,
//         Paid: 5,
//         Rejected: 0
//       },
//       21: { // Guest 21
//         Pending: 1,
//         Processing: 2,
//         Delivered: 3,
//         Paid: 5,
//         Rejected: 0
//       }
//     }
//   }
// }

type Props = {
  statistics: Statistics;
  tableList: Table[];
  servingGuestByTableNumber: ServingGuestByTableNumber;
};

export default function OrderStatistics({
  statistics,
  tableList,
  servingGuestByTableNumber,
}: Props) {
  const [selectedTableNumber, setSelectedTableNumber] = useState<number>(0);
  const selectedServingGuest = servingGuestByTableNumber[selectedTableNumber];

  return (
    <Fragment>
      <Dialog
        open={!!selectedTableNumber}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTableNumber(0);
          }
        }}
      >
        <DialogContent className="max-h-full overflow-auto">
          {selectedServingGuest && (
            <DialogHeader>
              <DialogTitle>
                Khách đang ngồi tại bàn {selectedTableNumber}
              </DialogTitle>
            </DialogHeader>
          )}
          <div>
            {selectedServingGuest &&
              Object.keys(selectedServingGuest).map((guestId, index) => {
                const orders = selectedServingGuest[Number(guestId)];

                return (
                  <div key={guestId}>
                    <OrderGuestDetail
                      guest={orders[0].guest!}
                      orders={orders}
                      onPaymentSuccess={() => {
                        setSelectedTableNumber(0);
                      }}
                    />
                    {index !== Object.keys(selectedServingGuest).length - 1 && (
                      <Separator className="my-5" />
                    )}
                  </div>
                );
              })}
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex justify-start items-stretch gap-4 flex-wrap py-4">
        {tableList.map((table) => {
          const tableNumber = table.number;
          const tableStatistics: Record<number, StatusCountObject> | undefined =
            statistics.table[tableNumber];
          let isEmptyTable = true;
          let statusCount: StatusCountObject = {
            Pending: 0,
            Processing: 0,
            Delivered: 0,
            Paid: 0,
            Rejected: 0,
          };
          const servingGuestCount = Object.values(
            servingGuestByTableNumber[tableNumber] ?? [],
          ).length;

          if (tableStatistics) {
            for (const guestId in tableStatistics) {
              const guestStatistics = tableStatistics[Number(guestId)];

              if (
                [
                  guestStatistics.Pending,
                  guestStatistics.Processing,
                  guestStatistics.Delivered,
                ].some((status) => status !== 0 && status !== undefined)
              ) {
                isEmptyTable = false;
              }

              statusCount = {
                Pending: statusCount.Pending + (guestStatistics.Pending ?? 0),
                Processing:
                  statusCount.Processing + (guestStatistics.Processing ?? 0),
                Delivered:
                  statusCount.Delivered + (guestStatistics.Delivered ?? 0),
                Paid: statusCount.Paid + (guestStatistics.Paid ?? 0),
                Rejected:
                  statusCount.Rejected + (guestStatistics.Rejected ?? 0),
              };
            }
          }

          return (
            <div
              key={tableNumber}
              className={cn(
                "text-sm flex items-stretch gap-2 border p-2 rounded-md",
                {
                  "bg-secondary": !isEmptyTable,
                  "border-transparent": !isEmptyTable,
                },
              )}
              onClick={() => {
                if (!isEmptyTable) {
                  setSelectedTableNumber(tableNumber);
                }
              }}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="font-semibold text-center text-lg">
                  {tableNumber}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4" />
                        <span>{servingGuestCount}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Đang phục vụ: {servingGuestCount} khách
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Separator
                orientation="vertical"
                className={cn("flex-shrink-0 flex-grow h-auto", {
                  "bg-muted-foreground": !isEmptyTable,
                })}
              />
              {isEmptyTable && (
                <div className="flex justify-between items-center text-sm">
                  Bàn trống
                </div>
              )}
              {!isEmptyTable && (
                <div className="flex flex-col gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex gap-2 items-center">
                          <OrderStatusIcon.Pending className="w-4 h-4" />
                          <span>{statusCount[OrderStatus.Pending] ?? 0}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {getVietnameseOrderStatus(OrderStatus.Pending)}:{" "}
                        {statusCount[OrderStatus.Pending] ?? 0} đơn
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex gap-2 items-center">
                          <OrderStatusIcon.Processing className="w-4 h-4" />
                          <span>
                            {statusCount[OrderStatus.Processing] ?? 0}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {getVietnameseOrderStatus(OrderStatus.Processing)}:{" "}
                        {statusCount[OrderStatus.Processing] ?? 0} đơn
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex gap-2 items-center">
                          <OrderStatusIcon.Delivered className="w-4 h-4" />
                          <span>{statusCount[OrderStatus.Delivered] ?? 0}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {getVietnameseOrderStatus(OrderStatus.Delivered)}:{" "}
                        {statusCount[OrderStatus.Delivered] ?? 0} đơn
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-start items-end gap-4 flex-wrap py-4">
        {OrderStatusValues.map((status) => (
          <Badge variant="secondary" key={status}>
            {getVietnameseOrderStatus(status)}: {statistics.status[status] ?? 0}
          </Badge>
        ))}
      </div>
    </Fragment>
  );
}
