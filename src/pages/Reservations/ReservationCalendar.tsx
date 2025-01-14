import FullCalendar from "@fullcalendar/react";
import {
  DateSelectArg,
  DateSpanApi,
  EventInput,
} from "@fullcalendar/core";
import React, { useEffect, useRef, useState } from "react";
import CreateReservationModal from "@/components/Modals/CreateReservationModal";
import { useDialog } from "@/stores/dialogStore";
import "../../styles/fullcalendar-shadcn.css";
import { ReservationDto, ResourcesAvailabilityDto } from "@/api";
import { useMaintenanceIntervalsInTimePeriod } from "@/data/maintenance/useMaintenanceIntervalsInTimePeriod";
import { useTranslation } from "react-i18next";
import ReservationPresentationCalendar from "@/pages/Reservations/ReservationPresentationCalendar";
import { useWindowLength } from "@/data/reservation/useWindowLength";

type TimeRange = {
  start: string | null,
  end: string | null,
}

type ReservationCalendarProps = {
  clusterId: string,
  courseId: string,
  podId: string,
  currentRange: TimeRange,
  setCurrentRange: React.Dispatch<React.SetStateAction<TimeRange>>,
  resources: ResourcesAvailabilityDto[] | undefined,
  resourcesLoading: boolean,
  reservations:  ReservationDto[] | undefined
  reservationsLoading: boolean,
};

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({
  clusterId, courseId, podId, currentRange, setCurrentRange, reservations, reservationsLoading, resources, resourcesLoading
}) => {
  const { t } = useTranslation();
  const { open } = useDialog();

  const calendarRef = useRef<FullCalendar | null>(null);

  const [ events, setEvents ] = useState<EventInput[]>([]);
  const [ eventStart, setEventStart ] = useState<Date | null>(null);
  const [ eventEnd, setEventEnd ] = useState<Date | null>(null);

  const { intervals, isLoading: intervalsLoading } = useMaintenanceIntervalsInTimePeriod(clusterId, currentRange.start, currentRange.end);
  const { length, isLoading: windowLoading } = useWindowLength();

  useEffect(() => {
    if (!currentRange.start || !currentRange.end) return;
    if (resourcesLoading || intervalsLoading || reservationsLoading || windowLoading) return;

    const newEvents: EventInput[] = [];
    resources?.forEach((resource: ResourcesAvailabilityDto) => {
      const resourceTime = resource.time! + 'Z';
      const startTime = new Date(resourceTime);
      const timeVar = new Date(resourceTime);
      const endTime = new Date(timeVar.setMinutes(timeVar.getMinutes() + 30));

      newEvents.push({
        start: startTime,
        end: endTime,
        overlap: resource.available,
        selectable: resource.available,
        display: "background",
        color: resource.available ? "lightgreen" : "red",
        disabled: true,
      });
    });

    intervals?.forEach((interval) => {
      newEvents.push({
        id: interval.id,
        groupId: 'MAINTENANCE_INTERVAL',
        title: interval.type === "SYSTEM" ? "System maintenance interval" : "Cluster maintenance interval",
        start: new Date(interval.beginAt! + "Z"),
        end: new Date(interval.endAt! + "Z"),
        color: interval.type === "SYSTEM" ? "#2A9D8F" : "#E63946",
      });
    });

    reservations?.forEach((reservation: ReservationDto) => {
      newEvents.push({
        groupId: 'RESERVATION',
        start: new Date(reservation.start! + "Z"),
        end: new Date(reservation.end! + "Z"),
        title: `Team ${reservation.team?.name}`,
        id: reservation.id,
      });
    });

    setEvents(newEvents);
  }, [currentRange, reservations, resources, intervals, podId, courseId, clusterId, length, windowLoading]);

  /* Calendar methods */

  const handleSelect = (arg: DateSelectArg) => {
    const calendarApi = calendarRef.current?.getApi();
    const { start, end } = arg;

    const viewType = arg.view.type;
    if (viewType == "dayGridMonth") return false;

    const currentDate = new Date();
    if (start < currentDate || end < currentDate) return;

    calendarApi?.unselect();
    setEventStart(start);
    setEventEnd(end);
    open("createReservation");
  };

  const handleAllowSelect = (arg: DateSpanApi) => {
    const { start, end } = arg;

    const calendarApi = calendarRef.current?.getApi();
    const currentView = calendarApi?.view.type;

    if (currentView == "dayGridMonth") return true;

    const currentDate = new Date();
    if (start < currentDate || end < currentDate) return false;

    const overlappingBackgroundEvents: EventInput[] = events.filter(
      (event) => event.end! > start && event.start! < end && event.selectable !== null
    );

    for (const foundEvent of overlappingBackgroundEvents) {
      if (foundEvent.selectable === false) return false;
    }

    return true;
  };

  const handleEventAllow = (arg: DateSpanApi) => {
    const { start } = arg;
    const currentDate = new Date();
    return !(start < currentDate);
  };

  /* Other methods */

  const closeCreateReservationDialog = () => {
    setEventStart(null);
    setEventEnd(null);
  };

  return (
    <>
      <CreateReservationModal
        courseId={courseId!}
        podId={podId!}
        length={length ?? 15}
        maxRentTime={12}
        start={eventStart!}
        end={eventEnd!}
        resetSelection={closeCreateReservationDialog}
      />

      <ReservationPresentationCalendar
        t={t}
        window={length ?? 10}
        windowLoading={windowLoading}
        calendarRef={calendarRef}
        currentRange={currentRange}
        setCurrentRange={setCurrentRange}
        select={handleSelect}
        allowSelect={handleAllowSelect}
        allowEvent={handleEventAllow}
        resources={resources}
        resourcesLoading={resourcesLoading}
        reservations={reservations}
        reservationsLoading={reservationsLoading}
        intervals={intervals}
        intervalsLoading={intervalsLoading} />
    </>
  );
};

export default ReservationCalendar;