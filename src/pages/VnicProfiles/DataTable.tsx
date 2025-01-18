import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef, ColumnFiltersState, FilterFn,
  flexRender,
  getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {useTranslation} from "react-i18next";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: Row<TData>) => void;
  paginationEnabled?: boolean;
  pageSize?: number;
};

const DataTable = <TData, TValue>({
                                    data,
                                    columns,
                                    onRowClick,
                                    pageSize = 10,
                                    paginationEnabled = false,
                                  }: DataTableProps<TData, TValue>) => {
  const {t} = useTranslation();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: pageSize, //default page size
  });

  //////BEGIN
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const customGlobalFilterFn: FilterFn<TData> = (row, columnId: string, filterValue: string) => {
    const search = filterValue.toLowerCase();

    const value = row.getValue(columnId);
    if (typeof value === 'number') {
      return String(value).toLowerCase().includes(search);
    }
    if (typeof value === 'string') {
      return value.toLowerCase().includes(search);
    }

    return false;
  };
  //////END

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: paginationEnabled
        ? getPaginationRowModel()
        : undefined,
    onPaginationChange: paginationEnabled ? setPagination : undefined,
    //////BEGIN
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: customGlobalFilterFn,
    //////END
    state: {
      sorting,
      pagination,
      //////BEGIN
      columnFilters,
      globalFilter
      //////END
    },
  });

  return (
      <div>
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
                                    header.getContext()
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
                          onClick={() => {
                            onRowClick?.(row);
                          }}
                      >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
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
                      {t("noResults")}
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
          >
            {t("previous")}
          </Button>
          <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
          >
            {t("next")}
          </Button>
        </div>
      </div>
  );
};

export default DataTable;
