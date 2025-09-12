"use client";

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { endOfDay, startOfDay } from "date-fns";
import { Check, ChevronsUpDown } from "lucide-react";
import { createContext, useEffect, useState } from "react";
import { toast } from "sonner";

import AddOrder from "@/app/[locale]/manage/orders/add-order";
import EditOrder from "@/app/[locale]/manage/orders/edit-order";
import OrderStatistics from "@/app/[locale]/manage/orders/order-statistics";
import columns from "@/app/[locale]/manage/orders/order-table-columns";
import TableSkeleton from "@/app/[locale]/manage/orders/table-skeleton";
import { Button } from "@/components";
import { useAppStore } from "@/components/app-provider";
import PaginationControl from "@/components/pagination-control";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusValues, SocketEvent } from "@/lib/constants";
import {
  cn,
  formatDate,
  getTableQueryResult,
  showResponseError,
} from "@/lib/utils";
import { getVietnameseOrderStatus } from "@/lib/utils";
import { useOrderListQuery, useUpdateOrderMutation } from "@/queries/order";
import { useTableListQuery } from "@/queries/table";
import { useOrdersStatistics } from "@/services/order";
import { GuestCreateOrdersResData } from "@/types/guest";
import {
  Order,
  PayGuestOrdersResData,
  UpdateOrderReqBody,
  UpdateOrderResData,
} from "@/types/order";

const PAGE_SIZE = 10;

type OrderTableContextType = {
  orderIdToEdit: number | undefined;
  setOrderIdToEdit: (value: number | undefined) => void;
  changeOrderStatus: (
    orderId: number,
    data: {
      dishId: number;
      quantity: number;
      status: (typeof OrderStatusValues)[number];
    },
  ) => void;
  ordersByGuestId: Record<number, Order[]>;
};

export const OrderTableContext = createContext<OrderTableContextType>({
  orderIdToEdit: undefined,
  setOrderIdToEdit: () => {},
  changeOrderStatus: () => {},
  ordersByGuestId: {},
});

export type StatusCountObject = Record<
  (typeof OrderStatusValues)[number],
  number
>;

export type Statistics = {
  status: StatusCountObject;
  table: Record<number, Record<number, StatusCountObject>>;
};

export type OrdersByGuestId = Record<number, Order[]>;

export type ServingGuestByTableNumber = Record<number, OrdersByGuestId>;

const INITIAL_FROM_DATE = startOfDay(new Date());
const INITIAL_TO_DATE = endOfDay(new Date());

export default function OrderTable() {
  const { socket } = useAppStore();
  const [fromDate, setFromDate] = useState(INITIAL_FROM_DATE);
  const [toDate, setToDate] = useState(INITIAL_TO_DATE);
  const [orderIdToEdit, setOrderIdToEdit] = useState<number>();
  const [openStatusFilter, setOpenStatusFilter] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const updateOrderMutation = useUpdateOrderMutation();
  const orderListQuery = useOrderListQuery({ fromDate, toDate });
  const tableListQuery = useTableListQuery();
  const { data: orderList, totalItem } = getTableQueryResult(orderListQuery);
  const { data: tableList } = getTableQueryResult(tableListQuery);
  const tableListSortedByNumber = tableList.sort((a, b) => a.number - b.number);
  const { statistics, ordersByGuestId, servingGuestByTableNumber } =
    useOrdersStatistics(orderList);
  const refreshOrderList = orderListQuery.refetch;

  const table = useReactTable({
    data: orderList,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    rowCount: totalItem,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const resetDateFilter = () => {
    setFromDate(INITIAL_FROM_DATE);
    setToDate(INITIAL_TO_DATE);
  };

  const changeOrderStatus = async (
    orderId: number,
    data: UpdateOrderReqBody,
  ) => {
    const response = await updateOrderMutation.mutateAsync({
      id: orderId,
      body: data,
    });

    if (!response.ok) {
      showResponseError(response);
      return;
    }
  };

  useEffect(() => {
    function onConnect() {
      console.log("Socket connected:", socket?.id);
    }

    function onDisconnect() {
      console.log("Socket disconnected");
    }

    function refresh() {
      const now = new Date();
      if (now >= fromDate && now <= toDate) {
        refreshOrderList();
      }
    }

    function onOrderUpdate(data: UpdateOrderResData) {
      const {
        dishSnapshot: { name },
        quantity,
        status,
      } = data;
      toast.success(
        `Món ${name} (x${quantity}) vừa được cập nhật sang trạng thái ${getVietnameseOrderStatus(status)}`,
        { richColors: true },
      );

      refresh();
    }

    function onNewOrder(data: GuestCreateOrdersResData) {
      const { guest } = data[0];
      toast.info(
        `${guest?.name} tại bàn ${guest?.tableNumber} vừa đặt ${data.length} món.`,
        { richColors: true },
      );

      refresh();
    }

    function onPayment(data: PayGuestOrdersResData) {
      const { guest } = data[0];

      toast.success(
        `${guest?.name} tại bàn ${guest?.tableNumber} đã thanh toán ${data.length} đơn.`,
        { richColors: true },
      );

      refresh();
    }

    if (socket?.connected) {
      onConnect();
    }

    socket?.on(SocketEvent.Connect, onConnect);
    socket?.on(SocketEvent.Disconnect, onDisconnect);
    socket?.on(SocketEvent.NewOrder, onNewOrder);
    socket?.on(SocketEvent.UpdateOrder, onOrderUpdate);
    socket?.on(SocketEvent.Payment, onPayment);

    return () => {
      socket?.off(SocketEvent.Connect, onConnect);
      socket?.off(SocketEvent.Disconnect, onDisconnect);
      socket?.off(SocketEvent.NewOrder, onNewOrder);
      socket?.off(SocketEvent.UpdateOrder, onOrderUpdate);
      socket?.off(SocketEvent.Payment, onPayment);
    };
  }, [fromDate, refreshOrderList, socket, toDate]);

  return (
    <OrderTableContext.Provider
      value={{
        orderIdToEdit,
        setOrderIdToEdit,
        changeOrderStatus: changeOrderStatus,
        ordersByGuestId,
      }}
    >
      <div className="w-full">
        <EditOrder
          id={orderIdToEdit}
          setId={setOrderIdToEdit}
          onSubmitSuccess={() => {}}
        />
        <div className=" flex items-center">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center">
              <span className="mr-2">Từ</span>
              <Input
                type="datetime-local"
                placeholder="Từ ngày"
                className="text-sm"
                value={formatDate(fromDate, "yyyy-MM-dd'T'HH:mm")}
                onChange={(event) => setFromDate(new Date(event.target.value))}
              />
            </div>
            <div className="flex items-center">
              <span className="mr-2">Đến</span>
              <Input
                type="datetime-local"
                placeholder="Đến ngày"
                value={formatDate(toDate, "yyyy-MM-dd'T'HH:mm")}
                onChange={(event) => setToDate(new Date(event.target.value))}
              />
            </div>
            <Button className="" variant={"outline"} onClick={resetDateFilter}>
              Hôm nay
            </Button>
          </div>
          <div className="ml-auto">
            <AddOrder />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 py-4">
          <Input
            placeholder="Tên khách hàng"
            value={
              (table.getColumn("guestName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("guestName")?.setFilterValue(event.target.value)
            }
            className="max-w-[150px]"
          />
          <Input
            placeholder="Số bàn"
            value={
              (table.getColumn("tableNumber")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("tableNumber")?.setFilterValue(event.target.value)
            }
            className="max-w-[100px]"
          />
          <Popover open={openStatusFilter} onOpenChange={setOpenStatusFilter}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openStatusFilter}
                className="w-[150px] text-sm justify-between"
              >
                {table.getColumn("status")?.getFilterValue()
                  ? getVietnameseOrderStatus(
                      table
                        .getColumn("status")
                        ?.getFilterValue() as (typeof OrderStatusValues)[number],
                    )
                  : "Trạng thái"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandGroup>
                  <CommandList>
                    {OrderStatusValues.map((status) => (
                      <CommandItem
                        key={status}
                        value={status}
                        onSelect={(currentValue) => {
                          table
                            .getColumn("status")
                            ?.setFilterValue(
                              currentValue ===
                                table.getColumn("status")?.getFilterValue()
                                ? ""
                                : currentValue,
                            );
                          setOpenStatusFilter(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            table.getColumn("status")?.getFilterValue() ===
                              status
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {getVietnameseOrderStatus(status)}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <OrderStatistics
          statistics={statistics}
          tableList={tableListSortedByNumber}
          servingGuestByTableNumber={servingGuestByTableNumber}
        />
        {orderListQuery.isPending ? (
          <TableSkeleton />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Không có đơn hàng.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-xs text-muted-foreground py-4 flex-1 ">
            Hiển thị{" "}
            <strong>{table.getPaginationRowModel().rows.length}</strong> trong{" "}
            <strong>{totalItem}</strong> kết quả
          </div>
          <div>
            <PaginationControl
              page={table.getState().pagination.pageIndex + 1}
              pageSize={PAGE_SIZE}
              totalItem={totalItem}
              onPageChange={(page) => {
                setPagination((prev) => ({ ...prev, pageIndex: page - 1 }));
              }}
            />
          </div>
        </div>
      </div>
    </OrderTableContext.Provider>
  );
}
