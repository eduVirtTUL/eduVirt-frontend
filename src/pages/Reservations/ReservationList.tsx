import { Route } from "./+types/index";
import { useCourseReservations } from "@/data/reservation/useCourseReservations";
import React, { useState } from "react";
import i18next from "i18next";
import { RouteHandle } from "@/AuthGuard";
import ReservationTable from "@/pages/Reservations/ReservationTable";

const ReservationList: React.FC<Route.ComponentProps> = ({
  params: { id }
}) => {
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

  return (
    <>
      <ReservationTable
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        pageSize={pageSize}
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
  roles: ["student", "teacher", "administrator"],
};

export const meta = () => {
  return [{ title: i18next.t("pageTitles.reservations") }];
};