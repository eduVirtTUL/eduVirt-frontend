import React, { useCallback, useEffect, useState } from "react";
import i18next, { TFunction } from "i18next";
import { ColumnDef } from "@tanstack/react-table";
import { EventGeneralDto } from "@/api";
import { CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvents } from "@/data/cluster/useEvents";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLinkIcon } from "lucide-react";
import SimpleDataTable from "@/components/SimpleDataTable";
import SimplePagination from "@/components/SimplePagination";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";

type EventListProps = {
  clusterId: string;
  clusterName: string;
}

const columns = (
  t: TFunction,
  handleSort: (column: string) => void,
  chooseSortingArrow: (column: string) => React.ReactNode
): ColumnDef<EventGeneralDto>[] => [
  {
    accessorKey: "message",
    header: () => {
      return (
        <Button variant="ghost" onClick={() => handleSort("message")}>
          {t("events.table.columns.message")}
          {(chooseSortingArrow("message"))}
        </Button>
      );
    }
  },
  {
    accessorKey: "severity",
    header: () => {
      return (
        <Button variant="ghost" onClick={() => handleSort("severity")}>
          {t("events.table.columns.severity.name")}
          {(chooseSortingArrow("severity"))}
        </Button>
      );
    },
    cell: ({ row }) => {
      const event = row.original;
      {/* @ts-expect-error this doesn't impact the page */}
      return t(`events.table.columns.severity.${event.severity}`);
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
      return actualTime.toLocaleString(i18next.language);
    },
  },
];

const EventList: React.FC<EventListProps> = ({
  clusterId, clusterName
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [ pageNumber, setPageNumber ] = useState<number>(0);
  const [ pageSize ] = useState<number>(10);
  const [ sortColumn, setSortColumn ] = useState<string>("time");
  const [ sortDirection, setSortDirection ] = useState<"asc" | "desc">("desc");

  const { events, isLoading } = useEvents({
    id: clusterId,
    size: pageSize,
    page: pageNumber,
    sort: sortColumn === null ? [] : [ `${sortColumn},${sortDirection}` ]
  });

  const { events: nextEvents, isLoading: nextLoading } = useEvents({
    id: clusterId,
    size: pageSize,
    page: pageNumber + 1,
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

  useEffect(() => {
    const checkAuthorization = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate(-1);
        return;
      }

      const decoded = jwtDecode<{ groups: string[] }>(token);
      const userGroups = decoded.groups;

      if (!userGroups.includes("/ovirt-administrator")) {
        toast.error("You don't have required privileges to see this page.");
        navigate(-1);
      }
    }

    checkAuthorization();
  }, [navigate, t]);

  if (isLoading || nextLoading) {
    return (
      <>
        <div className={"flex items-center justify-start pt-4 pl-4"}>
          <Skeleton className="h-10 w-1/4"/>
        </div>

        <div className="p-4">
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
        </div>
      </>
    );
  }

  return (
    <>
      <CardContent className={"p-4"}>
        <div className={"flex items-center justify-start pb-4"}>
          <Button
            className={"text-wrap"}
            variant="secondary"
            onClick={(e) => e.stopPropagation()}
            asChild
          >

            <Link
              target="_blank"
              to={`${import.meta.env.VITE_OVIRT_ENGINE_LOCATION}/webadmin/?locale=en_US#clusters-events;name=${clusterName}`}
            >
              <ExternalLinkIcon/>
              {t("clusters.details.ovirt.event")}
            </Link>
          </Button>
        </div>

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

export default EventList;