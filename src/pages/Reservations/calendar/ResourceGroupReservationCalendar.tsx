import { Route } from "../+types/index";
import React, { useState } from "react";
import "../../../styles/fullcalendar-shadcn.css";
import { useResourceGroupAvailability } from "@/data/reservation/useResourceGroupAvailability";
import { useResourceGroupReservations } from "@/data/reservation/useResourceGroupReservations";
import { useLocation } from "react-router";
import ReservationCalendar from "@/pages/Reservations/calendar/ReservationCalendar";
import {RouteHandle} from "@/AuthGuard";
import i18next from "i18next";

type TimeRange = {
  start: string | null,
  end: string | null,
}

const ResourceGroupReservationCalendar: React.FC<Route.ComponentProps> = ({ params: { id } }) => {
  const location = useLocation();
  const { clusterId, courseId, podId } = location.state || {};

  const [ currentRange, setCurrentRange ] = useState<TimeRange>({start: null, end: null});
  const { resources, isLoading: resourcesLoading } = useResourceGroupAvailability(courseId!, id!, currentRange.start!, currentRange.end!);

  const { reservations, isLoading: reservationsLoading } = useResourceGroupReservations({
    course: courseId!,
    resourceGroup: id!,
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

export default ResourceGroupReservationCalendar;

export const handle: RouteHandle = {
  roles: ["student", "teacher", "administrator"],
};

export const meta = () => {
  return [{ title: i18next.t("pageTitles.reservationCalendar") }];
};