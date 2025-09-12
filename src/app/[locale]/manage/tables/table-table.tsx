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

import AddTable from "@/app/[locale]/manage/tables/add-table";
import EditTable from "@/app/[locale]/manage/tables/edit-table";
import PaginationControl from "@/components/pagination-control";
import { TableQRCode } from "@/components/table-qr-code";
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
import { getTableQueryResult, getVietnameseTableStatus } from "@/lib/utils";
import { useTableListQuery } from "@/queries/table";
import { Table as TableType } from "@/types/table";

import DeleteTable from "./delete-table";

const PAGE_SIZE = 10;

const TableTableContext = createContext<{
  tableIdToEdit: number | undefined;
  setTableIdToEdit: (value: number) => void;
  tableToDelete: TableType | null;
  setTableToDelete: (value: TableType | null) => void;
}>({
  tableIdToEdit: undefined,
  setTableIdToEdit: () => {},
  tableToDelete: null,
  setTableToDelete: () => {},
});

export const columns: ColumnDef<TableType>[] = [
  {
    accessorKey: "number",
    header: "Số bàn",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("number")}</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.trim() === "") {
        return true;
      }

      // NOTE: The row value is a number, so we need to convert it to a string for comparison
      const rowValue = String(row.getValue(columnId));

      return rowValue.includes(filterValue);
    },
  },
  {
    accessorKey: "capacity",
    header: "Sức chứa",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("capacity")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => (
      <div>{getVietnameseTableStatus(row.getValue("status"))}</div>
    ),
  },
  {
    accessorKey: "token",
    header: "QR Code",
    cell: ({ row }) => (
      <TableQRCode
        token={row.getValue("token")}
        tableNumber={row.getValue("number")}
        width={200}
      />
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setTableIdToEdit, setTableToDelete } =
        useContext(TableTableContext);

      const openEditTable = () => {
        setTableIdToEdit(row.original.number);
      };

      const openDeleteTable = () => {
        setTableToDelete(row.original);
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
            <DropdownMenuItem onClick={openEditTable}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteTable}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function TableTable() {
  const [tableIdToEdit, setTableIdToEdit] = useState<number | undefined>();
  const [tableToDelete, setTableToDelete] = useState<TableType | null>(null);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const tableListQuery = useTableListQuery();
  const { data, totalItem } = getTableQueryResult(tableListQuery);

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

  return (
    <TableTableContext.Provider
      value={{
        tableIdToEdit,
        setTableIdToEdit,
        tableToDelete,
        setTableToDelete,
      }}
    >
      <div className="w-full">
        <EditTable id={tableIdToEdit} setId={setTableIdToEdit} />
        <DeleteTable table={tableToDelete} setTable={setTableToDelete} />
        <div className="flex items-center py-4">
          <Input
            placeholder="Lọc số bàn"
            value={
              (table.getColumn("number")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("number")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="ml-auto flex items-center gap-2">
            <AddTable />
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
    </TableTableContext.Provider>
  );
}
