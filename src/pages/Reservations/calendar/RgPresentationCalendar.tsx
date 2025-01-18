import { Route } from "../+types/index";
import { useTranslation } from "react-i18next";
import ReservationPresentationCalendar from "@/pages/Reservations/calendar/ReservationPresentationCalendar";
import {useLocation, useNavigate} from "react-router";
import {useEffect, useRef, useState} from "react";
import FullCalendar from "@fullcalendar/react";
import { useWindowLength } from "@/data/reservation/useWindowLength";
import { useMaintenanceIntervalsInTimePeriod } from "@/data/maintenance/useMaintenanceIntervalsInTimePeriod";
import { useResourceGroupAvailability } from "@/data/reservation/useResourceGroupAvailability";
import { useResourceGroupReservations } from "@/data/reservation/useResourceGroupReservations";
import {RouteHandle} from "@/AuthGuard";
import i18next from "i18next";

type TimeRange = {
  start: string | null,
  end: string | null,
}

const RgPresentationCalendar: React.FC<Route.ComponentProps> = ({ params: { id }}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const location = useLocation();
  const { clusterId, courseId } = location.state || {};

  const calendarRef = useRef<FullCalendar | null>(null);

  const { length, isLoading: windowLoading } = useWindowLength();

  const [ currentRange, setCurrentRange ] = useState<TimeRange>({start: null, end: null});
  const { resources, isLoading: resourcesLoading } = useResourceGroupAvailability(courseId!, id!, currentRange.start!, currentRange.end!);
  const { intervals, isLoading: intervalsLoading } = useMaintenanceIntervalsInTimePeriod(clusterId, currentRange.start, currentRange.end);

  const {reservations, isLoading: reservationsLoading} = useResourceGroupReservations({
    course: courseId!,
    resourceGroup: id!,
    start: currentRange.start,
    end: currentRange.end
  });

  useEffect(() => {
    if ((!reservationsLoading && !reservations) && !(resourcesLoading && !resources)) navigate(-1);
  }, [navigate, resources, resourcesLoading, reservations, reservationsLoading]);

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

export default RgPresentationCalendar;

export const handle: RouteHandle = {
    roles: ["teacher", "administrator"],
};

export const meta = () => {
    return [{ title: i18next.t("pageTitles.reservationCalendar") }];
};