import { Route } from "./+types/index";
import { useCourseReservations } from "@/data/reservation/useCourseReservations";
import React, {useCallback, useState} from "react";
import i18next from "i18next";
import { RouteHandle } from "@/AuthGuard";
import ReservationTable from "@/pages/Reservations/ReservationTable";
import {ArrowDown, ArrowUp, ArrowUpDown} from "lucide-react";

const ReservationList: React.FC<Route.ComponentProps> = ({
  params: { id }
}) => {
  const [ active, setActive ] = useState<boolean>(true);

  const [ pageNumber, setPageNumber ] = useState<number>(0);
  const [ pageSize ] = useState<number>(10);

  const [ sortColumn, setSortColumn ] = useState<string>(active ? "startTime" : "endTime");
  const [ sortDirection, setSortDirection ] = useState<"asc" | "desc">("asc");

  const { reservations, isLoading } = useCourseReservations({
    id: id!,
    active: active,
    page: pageNumber,
    size: pageSize,
    sort: [ `${sortColumn},${sortDirection}` ]
  });

  const { reservations: nextReservations, isLoading: nextLoading } = useCourseReservations({
    id: id!,
    active: active,
    page: pageNumber + 1,
    size: pageSize,
    sort: [ `${sortColumn},${sortDirection}` ]
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

  return (
    <>
      <ReservationTable
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        pageSize={pageSize}
        handleSort={handleSort}
        chooseSortingArrow={chooseSortingArrow}
        active={active}
        setActive={setActive}
        reservations={reservations ?? []}
        isLoading={isLoading}
        nextReservations={nextReservations ?? []}
        nextLoading={nextLoading}
      />
    </>
  );
};

export default ReservationList;

export const handle: RouteHandle = {
  roles: ["student"],
};

export const meta = () => {
  return [{ title: i18next.t("pageTitles.reservations") }];
};