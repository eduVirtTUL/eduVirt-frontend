import { useTranslation } from "react-i18next";
import React, { useCallback, useState } from "react";
import { useVmEvents } from "@/data/vm/useVmEvents";
import { Skeleton } from "@/components/ui/skeleton";
import { CardContent } from "@/components/ui/card";
import SimpleDataTable from "@/components/SimpleDataTable";
import SimplePagination from "@/components/SimplePagination";
import { TFunction } from "i18next";
import { ColumnDef } from "@tanstack/react-table";
import { EventGeneralDto } from "@/api";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

const columns = (
  t: TFunction,
  handleSort: (column: string) => void,
  chooseSortingArrow: (column: string) => JSX.Element
): ColumnDef<EventGeneralDto>[] => [
  {
    accessorKey: "message",
    header: t("events.table.columns.message")
  },
  {
    accessorKey: "severity",
    header: () => {
      return (
        <Button variant="ghost" onClick={() => handleSort("severity")}>
          {t("events.table.columns.severity")}
          {(chooseSortingArrow("severity"))}
        </Button>
      );
    }
  },
  {
    accessorKey: "registeredAt",
    header: () => {
      return (
        <Button variant="ghost" onClick={() => handleSort("time")}>
          {t("events.table.columns.registeredAt")}
          {(chooseSortingArrow("time"))}
        </Button>
      );
    },
    cell: (registeredAt) => {
      const value = registeredAt.getValue() as string;
      const actualTime = new Date(value + 'Z');
      return actualTime.toLocaleString();
    },
  },
];

type VmEventListProps = {
  id: string;
}

const VmEventList: React.FC<VmEventListProps> = ({
  id
}) => {
  const { t } = useTranslation();

  const [ pageNumber, setPageNumber ] = useState<number>(0);
  const [ pageSize ] = useState<number>(10);

  const [ sortColumn, setSortColumn ] = useState<string | null>(null);
  const [ sortDirection, setSortDirection ] = useState<"asc" | "desc" | null>(null);

  const { events, isLoading } = useVmEvents({
    id: id,
    page: pageNumber,
    size: pageSize,
    sort: sortColumn === null ? [] : [ `${sortColumn},${sortDirection}` ]
  });

  const { events: nextEvents, isLoading: nextLoading } = useVmEvents({
    id: id,
    page: pageNumber + 1,
    size: pageSize,
    sort: sortColumn === null ? [] : [ `${sortColumn},${sortDirection}` ]
  });

  const handleSort = useCallback((column: string) => {
    if (sortColumn === column) {
      setSortDirection((prevDirection) => prevDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  }, [sortColumn]);

  const chooseSortingArrow = (column: string) => {
    if (column === sortColumn && sortDirection === "desc")
      return <ArrowDown className="ml-2 h-4 w-4" />;
    else if (column === sortColumn && sortDirection === "asc")
      return <ArrowUp className="ml-2 h-4 w-4" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  if (isLoading || nextLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-md border">
          <div className="border-b">
            <div className="grid grid-cols-3 p-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-4 w-[100px]"/>
              ))}
            </div>
          </div>
          <div>
            {Array.from({ length: pageSize }, (_, i) => i + 1).map((row) => (
              <div key={row} className="grid grid-cols-3 p-4 border-b">
                {[1, 2, 3].map((col) => (
                  <Skeleton key={col} className="h-4 w-[100px]"/>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center space-x-3 mt-4">
          <Skeleton className="h-8 w-[100px]"/>
          <Skeleton className="h-8 w-[40px]"/>
          <Skeleton className="h-8 w-[100px]"/>
        </div>
      </div>
    );
  }

  return (
    <>
      <CardContent>
        <SimpleDataTable
          data={events ?? []}
          columns={columns(t, handleSort, chooseSortingArrow)}
        />

        <SimplePagination
            page={pageNumber}
            setPage={setPageNumber}
            hasMore={nextEvents !== undefined && nextEvents.length !== 0}
        />
      </CardContent>
    </>
  );
};

export default VmEventList;