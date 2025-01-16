import React, { useState } from "react";
import "../../styles/fullcalendar-shadcn.css";
import { useLocation } from "react-router";
import { useResourceGroupPoolAvailability } from "@/data/reservation/useResourceGroupPoolAvailability";
import { useResourceGroupPoolReservations } from "@/data/reservation/useResourceGroupPoolReservations";
import ReservationCalendar from "@/pages/Reservations/ReservationCalendar";
import { Route } from "./+types/index";
import {RouteHandle} from "@/AuthGuard";
import i18next from "i18next";

type TimeRange = {
  start: string | null,
  end: string | null,
}

const ResourceGroupPoolReservationCalendar: React.FC<Route.ComponentProps> = ({ params: { id }}) => {
  const location = useLocation();
  const { clusterId, courseId, podId } = location.state || {};

  const [ currentRange, setCurrentRange ] = useState<TimeRange>({start: null, end: null});
  const { resources, isLoading: resourcesLoading } = useResourceGroupPoolAvailability(courseId!, id!, currentRange.start!, currentRange.end!);

  const {reservations, isLoading: reservationsLoading} = useResourceGroupPoolReservations({
    course: courseId!,
    resourceGroupPool: id!,
    start: currentRange.start,
    end: currentRange.end
  });

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
        reservationsLoading={reservationsLoading} />
    </>
  );
};

export default ResourceGroupPoolReservationCalendar;

export const handle: RouteHandle = {
  roles: ["student", "teacher", "administrator"],
};

export const meta = () => {
  return [{ title: i18next.t("pageTitles.reservationCalendar") }];
};