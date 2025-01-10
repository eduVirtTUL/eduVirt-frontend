import React, { useState } from "react";
import "../../styles/fullcalendar-shadcn.css";
import { useLocation } from "react-router";
import {useResourceGroupPoolAvailability} from "@/data/reservation/useResourceGroupPoolAvailability";
import {useResourceGroupPoolReservations} from "@/data/reservation/useResourceGroupPoolReservations";
import ReservationCalendar from "@/pages/Reservations/ReservationCalendar";
import { Route } from "./+types/index";

type TimeRange = {
  start: string | null,
  end: string | null,
}

const ResourceGroupPoolReservationCalendar: React.FC<Route.ComponentProps> = ({ params: { id }}) => {
  const timeWindow = 30;

  const location = useLocation();
  const { clusterId, courseId, podId } = location.state || {};

  const [ currentRange, setCurrentRange ] = useState<TimeRange>({start: null, end: null});
  const { resources, isLoading: resourcesLoading } = useResourceGroupPoolAvailability(courseId!, id!, timeWindow, currentRange.start!, currentRange.end!);

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
        timeWindow={timeWindow}
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