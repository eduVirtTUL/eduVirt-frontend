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
import {useTranslation} from "react-i18next";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

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
        {/*Pagination*/}
        <Pagination className="space-x-3">
          <PaginationContent className={"flex items-center justify-between mt-4"}>
            <PaginationItem>
              <PaginationPrevious
                  onClick={() => table.previousPage()}
                  aria-disabled={!table.getCanPreviousPage()}
                  tabIndex={pagination.pageIndex <= 0 ? -1 : undefined}
                  className={pagination.pageIndex <= 0 ? "pointer-events-none opacity-50" : undefined}
              >
                {t("general.previous")}
              </PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>
                {pagination.pageIndex + 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                  onClick={() => table.nextPage()}
                  aria-disabled={!table.getCanNextPage()}
                  tabIndex={!table.getCanNextPage() ? -1 : undefined}
                  className={
                    !table.getCanNextPage() ? "pointer-events-none opacity-50" : undefined
                  }
              >
                {t("general.next")}
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
  );
};

export default DataTable;
