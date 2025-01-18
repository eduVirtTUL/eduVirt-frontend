import { ReservationDto } from "@/api";
import { Button } from "@/components/ui/button";
import {ExternalLink, Undo2} from "lucide-react";
import { Link } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/PageHeader";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import SimpleDataTable from "@/components/SimpleDataTable";
import SimplePagination from "@/components/SimplePagination";
import { useTranslation } from "react-i18next";
import React from "react";
import {useNavigate} from "react-router";

type ReservationTableProps = {
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;

  handleSort: (column: string) => void,
  chooseSortingArrow: (column: string) => React.ReactNode,

  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;

  reservations: ReservationDto[];
  isLoading: boolean;

  nextReservations: ReservationDto[];
  nextLoading: boolean;
};

const columns = (
  t: TFunction,
  handleSort: (column: string) => void,
  chooseSortingArrow: (column: string) => React.ReactNode
): ColumnDef<ReservationDto>[] => [
  {
    accessorKey: "resourceGroup.name",
    header: () => {
      return (
        <Button variant="ghost" onClick={() => handleSort("resourceGroup.name")}>
          {t("reservations.table.columns.rgName")}
          {(chooseSortingArrow("resourceGroup.name"))}
        </Button>
      );
    },
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
    header: () => {
      return (
        <Button variant="ghost" onClick={() => handleSort("resourceGroup.name")}>
          {t("reservations.table.columns.teamName")}
          {(chooseSortingArrow("team.name"))}
        </Button>
      );
    },
  },
  {
    accessorKey: "start",
    header: () => {
      return (
        <Button variant="ghost" onClick={() => handleSort("startTime")}>
          {t("reservations.table.columns.start")}
          {(chooseSortingArrow("startTime"))}
        </Button>
      );
    },
    cell: (start) => {
      const value = start.getValue() as string;
      const startTime = new Date(value + 'Z');
      return startTime.toLocaleString();
    },
  },
  {
    accessorKey: "end",
    header: () => {
      return (
        <Button variant="ghost" onClick={() => handleSort("endTime")}>
          {t("reservations.table.columns.end")}
          {(chooseSortingArrow("endTime"))}
        </Button>
      );
    },
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
        <>
          <div className="flex justify-end">
            <Link
              to={`/reservations/${reservation.id}`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
            >
              <ExternalLink className="h-4 w-4"/>
              <span className="sr-only">{t("reservations.table.showDetails")}</span>
            </Link>
          </div>
        </>
      );
    },
  },
];

const ReservationTable: React.FC<ReservationTableProps> = ({
    pageNumber, setPageNumber, pageSize, handleSort, chooseSortingArrow,
  active, setActive, reservations, isLoading, nextReservations, nextLoading
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
      <div className="flex justify-start">
        <Button variant="outline" onClick={() => (navigate(-1))} size="icon" className="mr-5">
          <Undo2/>
        </Button>
        <PageHeader title={t("reservations.title")} />
        {/*<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">*/}
        {/*  {t("reservations.altName")}*/}
        {/*</h3>*/}
      </div>

      <div className="p-3 flex flex-row items-center justify-end">
        <div className={"flex flex-row space-x-3"}>
          <Switch checked={active} onCheckedChange={setActive} />
          <div className="space-y-0.5">
            <Label className="text-base">{t("reservations.active")}</Label>
          </div>
        </div>
      </div>

      <SimpleDataTable
        columns={columns(t, handleSort, chooseSortingArrow)}
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

export default ReservationTable;