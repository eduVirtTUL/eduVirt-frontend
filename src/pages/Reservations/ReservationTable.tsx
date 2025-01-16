import { ReservationDto } from "@/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
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

type ReservationTableProps = {
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;

  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;

  reservations: ReservationDto[];
  isLoading: boolean;

  nextReservations: ReservationDto[];
  nextLoading: boolean;
};

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

const ReservationTable: React.FC<ReservationTableProps> = ({
    pageNumber, setPageNumber, pageSize,
  active, setActive, reservations, isLoading, nextReservations, nextLoading
}) => {
  const { t } = useTranslation();

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

export default ReservationTable;