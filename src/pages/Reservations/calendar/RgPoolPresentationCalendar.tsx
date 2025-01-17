import { Route } from "../+types/index";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { useWindowLength } from "@/data/reservation/useWindowLength";
import { useResourceGroupPoolAvailability } from "@/data/reservation/useResourceGroupPoolAvailability";
import { useMaintenanceIntervalsInTimePeriod } from "@/data/maintenance/useMaintenanceIntervalsInTimePeriod";
import { useResourceGroupPoolReservations } from "@/data/reservation/useResourceGroupPoolReservations";
import ReservationPresentationCalendar from "@/pages/Reservations/calendar/ReservationPresentationCalendar";
import {RouteHandle} from "@/AuthGuard";
import i18next from "i18next";

type TimeRange = {
  start: string | null,
  end: string | null,
}

const RgPoolPresentationCalendar: React.FC<Route.ComponentProps> = ({ params: { id }}) => {
  const { t } = useTranslation();

  const location = useLocation();
  const { clusterId, courseId } = location.state || {};

  const calendarRef = useRef<FullCalendar | null>(null);

  const { length, isLoading: windowLoading } = useWindowLength();

  const [ currentRange, setCurrentRange ] = useState<TimeRange>({start: null, end: null});
  const { resources, isLoading: resourcesLoading } = useResourceGroupPoolAvailability(courseId!, id!, currentRange.start!, currentRange.end!);
  const { intervals, isLoading: intervalsLoading } = useMaintenanceIntervalsInTimePeriod(clusterId, currentRange.start, currentRange.end);

  const {reservations, isLoading: reservationsLoading} = useResourceGroupPoolReservations({
    course: courseId!,
    resourceGroupPool: id!,
    start: currentRange.start,
    end: currentRange.end
  });

  return (
    <>
      <ReservationPresentationCalendar
        t={t}
        calendarRef={calendarRef}
        currentRange={currentRange}
        setCurrentRange={setCurrentRange}
        window={length ?? 15}
        windowLoading={windowLoading}
        select={undefined}
        allowSelect={undefined}
        allowEvent={undefined}
        resources={resources}
        resourcesLoading={resourcesLoading}
        reservations={reservations}
        reservationsLoading={reservationsLoading}
        intervals={intervals}
        intervalsLoading={intervalsLoading}
      />
    </>
  );
};

export default RgPoolPresentationCalendar;

export const handle: RouteHandle = {
    roles: ["teacher", "administrator"],
};

export const meta = () => {
    return [{ title: i18next.t("pageTitles.reservationCalendar") }];
};