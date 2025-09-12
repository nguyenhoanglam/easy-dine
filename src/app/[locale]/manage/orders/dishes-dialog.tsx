import {
  ColumnDef,
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
import Image from "next/image";
import { useState } from "react";

import PaginationControl from "@/components/pagination-control";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatCurrency,
  getTableQueryResult,
  getVietnameseDishStatus,
  matchesSearchQuery,
} from "@/lib/utils";
import { useDishListQuery } from "@/queries/dish";
import { Dish } from "@/types/dish";

const PAGE_SIZE = 10;

export const columns: ColumnDef<Dish>[] = [
  {
    id: "dishName",
    header: "Món ăn",
    cell: ({ row }) => (
      <div className="flex items-center space-x-4">
        <Image
          src={row.original.image}
          alt={row.original.name}
          width={50}
          height={50}
          className="rounded-md object-cover w-[50px] h-[50px]"
        />
        <span>{row.original.name}</span>
      </div>
    ),
    filterFn: (row, columnId, filterValue: string) => {
      return matchesSearchQuery(row.original.name, filterValue);
    },
  },
  {
    accessorKey: "price",
    header: "Giá cả",
    cell: ({ row }) => (
      <div className="capitalize">{formatCurrency(row.getValue("price"))}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => (
      <div>{getVietnameseDishStatus(row.getValue("status"))}</div>
    ),
  },
];

export function DishesDialog({ onChoose }: { onChoose: (dish: Dish) => void }) {
  const [open, setOpen] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const dishListQuery = useDishListQuery();
  const { data, totalItem } = getTableQueryResult(dishListQuery);

  const table = useReactTable({
    data,
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

  const choose = (dish: Dish) => {
    onChoose(dish);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Thay đổi</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-full overflow-auto">
        <DialogHeader>
          <DialogTitle>Chọn món ăn</DialogTitle>
        </DialogHeader>
        <div>
          <div className="w-full">
            <div className="flex items-center py-4">
              <Input
                placeholder="Lọc tên"
                value={
                  (table.getColumn("dishName")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn("dishName")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            </div>
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
                        onClick={() => choose(row.original)}
                        className="cursor-pointer"
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
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="text-xs text-muted-foreground py-4 flex-1 ">
                Hiển thị{" "}
                <strong>{table.getPaginationRowModel().rows.length}</strong>{" "}
                trong <strong>{totalItem}</strong> kết quả
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
