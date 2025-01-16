import { Route } from "./+types/index";
import { useCourseReservations } from "@/data/reservation/useCourseReservations";
import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/react-table";
import { ReservationDto } from "@/api";
import i18next, { TFunction } from "i18next";
import SimpleDataTable from "@/components/SimpleDataTable";
import SimplePagination from "@/components/SimplePagination";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router";
import {RouteHandle} from "@/AuthGuard";

const columns = (
  t: TFunction
): ColumnDef<ReservationDto>[] => [
  {
    accessorKey: "resourceGroup.name",
    header: t("reservations.table.columns.rgName"),
  },
  {
    accessorKey: "resourceGroup.stateless",
    header: t("reservations.table.columns.rgType"),
    cell: (stateless) => {
      if (stateless) return t("reservations.table.stateless")
      else return t("reservations.table.stateful")
    },
  },
  {
    accessorKey: "team.name",
    header: t("reservations.table.columns.teamName"),
  },
  {
    accessorKey: "start", header: t("reservations.table.columns.start"),
    cell: (start) => {
      const value = start.getValue() as string;
      const startTime = new Date(value + 'Z');
      return startTime.toLocaleString();
    },
  },
  {
    accessorKey: "end", header: t("reservations.table.columns.end"),
    cell: (end) => {
      const value = end.getValue() as string;
      const endTime = new Date(value + 'Z');
      return endTime.toLocaleString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const reservation = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">
                {t("reservations.table.openMenu")}
              </span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/reservations/${reservation.id}`}>
                {t("reservations.table.showDetails")}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const ReservationList: React.FC<Route.ComponentProps> = ({
  params: { id }
}) => {
  const { t } = useTranslation();

  const [ active, setActive ] = useState<boolean>(true);
  const [ pageNumber, setPageNumber ] = useState<number>(0);
  const [ pageSize ] = useState<number>(10);

  const { reservations, isLoading } = useCourseReservations({
    id: id!,
    active: active,
    page: pageNumber,
    size: pageSize
  });

  const { reservations: nextReservations, isLoading: nextLoading } = useCourseReservations({
    id: id!,
    active: active,
    page: pageNumber + 1,
    size: pageSize
  });

  if (isLoading || nextLoading) {
    return (
      <>
        <PageHeader title={t("reservations.title")} />

        <div className="p-3 flex flex-row items-center justify-end">
          <Skeleton className="h-8 w-[300px]" />
        </div>

        <div className="space-y-6">
          <div className="rounded-md border">
            <div className="border-b">
              <div className="grid grid-cols-5 p-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-4 w-[100px]" />
                ))}
              </div>
            </div>
            <div>
              {Array.from({ length: pageSize }, (_, i) => i + 1).map((row) => (
                <div key={row} className="grid grid-cols-5 p-4 border-b">
                  {[1, 2, 3, 4, 5].map((col) => (
                    <Skeleton key={col} className="h-4 w-[100px]" />
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
      </>
    );
  }

  return (
    <>
      <PageHeader title={t("reservations.title")} />

      <div className="p-3 flex flex-row items-center justify-end">
        <div className={"flex flex-row space-x-3"}>
          <Switch checked={active} onCheckedChange={setActive} />
          <div className="space-y-0.5">
            <Label className="text-base">{t("reservations.active")}</Label>
          </div>
        </div>
      </div>

      <SimpleDataTable
        columns={columns(t)}
        data={reservations ?? []}
      />

      <SimplePagination
          page={pageNumber}
          setPage={setPageNumber}
          hasMore={nextReservations !== undefined && nextReservations.length !== 0}
      />
    </>
  );
};

export default ReservationList;

export const handle: RouteHandle = {
  roles: ["student", "teacher", "administrator"],
};

export const meta = () => {
  return [{ title: i18next.t("pageTitles.reservations") }];
};