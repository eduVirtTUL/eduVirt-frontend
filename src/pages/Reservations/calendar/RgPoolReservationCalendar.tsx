import { Route } from "../+types/index";
import React, { useEffect, useState } from "react";
import "../../../styles/fullcalendar-shadcn.css";
import { useLocation, useNavigate } from "react-router";
import { useResourceGroupPoolAvailability } from "@/data/reservation/useResourceGroupPoolAvailability";
import { useResourceGroupPoolReservations } from "@/data/reservation/useResourceGroupPoolReservations";
import ReservationCalendar from "@/pages/Reservations/calendar/ReservationCalendar";
import { RouteHandle } from "@/AuthGuard";
import i18next from "i18next";

type TimeRange = {
  start: string | null,
  end: string | null,
}

const RgPoolReservationCalendar: React.FC<Route.ComponentProps> = ({ params: { id }}) => {
  const location = useLocation();
  const { clusterId, courseId, podId, maxRentTime } = location.state || {};
  const navigate = useNavigate();

  const [ currentRange, setCurrentRange ] = useState<TimeRange>({start: null, end: null});
  const { resources, isLoading: resourcesLoading } = useResourceGroupPoolAvailability(courseId!, id!, currentRange.start!, currentRange.end!);

  const {reservations, isLoading: reservationsLoading} = useResourceGroupPoolReservations({
    course: courseId!,
    resourceGroupPool: id!,
    start: currentRange.start,
    end: currentRange.end
  });

  useEffect(() => {
    if ((!reservationsLoading && !reservations) && !(resourcesLoading && !resources)) navigate(-1);
  }, [navigate, resources, resourcesLoading, reservations, reservationsLoading]);

  return (
    <>
      <ReservationCalendar
        clusterId={clusterId}
        courseId={courseId}
        podId={podId}
        currentRange={currentRange}
        setCurrentRange={setCurrentRange}
        resources={resources}
        resourcesLoading={resourcesLoading}
        reservations={reservations}
        reservationsLoading={reservationsLoading}
        maxRentTime={maxRentTime}
      />
    </>
  );
};

export default RgPoolReservationCalendar;

export const handle: RouteHandle = {
  roles: ["student"],
};

export const meta = () => {
  return [{ title: i18next.t("pageTitles.reservationCalendar") }];
};