"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
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
import { createContext, useContext, useState } from "react";

import AddDish from "@/app/[locale]/manage/dishes/add-dish";
import DeleteDish from "@/app/[locale]/manage/dishes/delete-dish";
import EditDish from "@/app/[locale]/manage/dishes/edit-dish";
import PaginationControl from "@/components/pagination-control";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  removeDiacritics,
} from "@/lib/utils";
import { useDishListQuery } from "@/queries/dish";
import { Dish } from "@/types/dish";

const PAGE_SIZE = 10;

const DishTableContext = createContext<{
  dishIdToEdit: number | undefined;
  setDishIdToEdit: (value: number) => void;
  dishToDelete: Dish | null;
  setDishToDelete: (value: Dish | null) => void;
}>({
  dishIdToEdit: undefined,
  setDishIdToEdit: () => {},
  dishToDelete: null,
  setDishToDelete: () => {},
});

const columns: ColumnDef<Dish>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "image",
    header: "Ảnh",
    cell: ({ row }) => (
      <div>
        <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
          <AvatarImage src={row.getValue("image")} />
          <AvatarFallback className="rounded-none">
            {row.original.name}
          </AvatarFallback>
        </Avatar>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Tên",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.trim() === "") {
        return true;
      }

      return removeDiacritics(row.getValue(columnId))
        .toLowerCase()
        .includes(removeDiacritics(filterValue).toLowerCase());
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
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <div
        dangerouslySetInnerHTML={{ __html: row.getValue("description") }}
        className="whitespace-pre-line"
      />
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => (
      <div>{getVietnameseDishStatus(row.getValue("status"))}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setDishIdToEdit, setDishToDelete } = useContext(DishTableContext);

      const openEditDish = () => {
        setDishIdToEdit(row.original.id);
      };

      const openDeleteDish = () => {
        setDishToDelete(row.original);
      };

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEditDish}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteDish}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function DishTable() {
  const [dishIdToEdit, setDishIdToEdit] = useState<number | undefined>();
  const [dishToDelete, setDishToDelete] = useState<Dish | null>(null);

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
    // The next 2 lines are important for manual pagination
    manualPagination: true,
    rowCount: totalItem,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <DishTableContext.Provider
      value={{
        dishIdToEdit,
        setDishIdToEdit,
        dishToDelete,
        setDishToDelete,
      }}
    >
      <div className="w-full">
        <EditDish id={dishIdToEdit} setId={setDishIdToEdit} />
        <DeleteDish dish={dishToDelete} setDish={setDishToDelete} />
        <div className="flex items-center py-4">
          <Input
            placeholder="Lọc tên"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="ml-auto flex items-center gap-2">
            <AddDish />
          </div>
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
    </DishTableContext.Provider>
  );
}
