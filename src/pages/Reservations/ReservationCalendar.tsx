import FullCalendar from "@fullcalendar/react";
import { DateClickArg } from "@fullcalendar/interaction";
import {
  DateSelectArg,
  DateSpanApi, DatesSetArg,
  EventClickArg,
  EventInput,
  ToolbarInput,
} from "@fullcalendar/core";
import React, { useEffect, useRef, useState } from "react";
import CreateReservationModal from "@/pages/Reservations/modals/CreateReservationModal";
import { useDialog } from "@/stores/dialogStore";
import "../../styles/fullcalendar-shadcn.css";
import { useCourseResourcesAvailability } from "@/data/reservation/useCourseResourcesAvailability";
import { ReservationDto, ResourcesAvailabilityDto } from "@/api";
import { useMaintenanceIntervalsInTimePeriod } from "@/data/maintenance/useMaintenanceIntervalsInTimePeriod";
import { useReservations } from "@/data/reservation/useReservations";
import EventCalendar from "@/components/EventCalendar";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import MaintenanceIntervalModal from "@/pages/MaintenanceInterval/MaintenanceIntervalModal";
import {Route} from "../../../.react-router/types/src/pages/Course/+types";

const headerToolbar: ToolbarInput = {
  center: "title",
  left: "prev,next",
  right: "timeGridWeek,dayGridMonth,today",
};

type TimeRange = {
  start: string | null,
  end: string | null,
}

const ReservationCalendar: React.FC<Route.ComponentProps> = ({params: {clusterId, courseId, resourceGroupId}}) => {
  const { t } = useTranslation();
  const calendarRef = useRef<FullCalendar | null>(null);
  const navigate = useNavigate();

  const {open} = useDialog();

  const [events, setEvents] = useState<EventInput[]>([]);

  const [currentRange, setCurrentRange] = useState<TimeRange>({start: null, end: null});
  const {resources, isLoading: resourcesLoading} = useCourseResourcesAvailability(courseId!, currentRange.start!, currentRange.end!);
  const {intervals, isLoading: intervalsLoading} = useMaintenanceIntervalsInTimePeriod(clusterId, currentRange.start, currentRange.end);
  const {reservations, isLoading: reservationsLoading} = useReservations({
    id: resourceGroupId!,
    start: currentRange.start,
    end: currentRange.end
  });

  const [eventStart, setEventStart] = useState<Date | null>(null);
  const [eventEnd, setEventEnd] = useState<Date | null>(null);

  const [ clickedInterval, setClickedInterval ] = useState<string | null>(null);

  useEffect(() => {
    if (!currentRange.start || !currentRange.end) return;
    if (resourcesLoading || intervalsLoading || reservationsLoading) return;

    const newEvents: EventInput[] = [];
    resources?.forEach((resource: ResourcesAvailabilityDto) => {
      const resourceTime = resource.time! + 'Z';
      const startTime = new Date(resourceTime);
      const timeVar = new Date(startTime);
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
        title: `Reservation ${reservation.id}`,
        id: reservation.id,
      });
    });

    setEvents(newEvents);
  }, [currentRange, reservations, resources, intervals, resourceGroupId, courseId, clusterId]);

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

  const handleEventClick = (arg: EventClickArg) => {
    if (arg.event.groupId === 'MAINTENANCE_INTERVAL') {
      setClickedInterval(arg.event.id);
      open("showMaintenanceInterval");
    } else {
      navigate(`/reservations/${arg.event.id}`);
    }
  };

  const handleDateClick = (info: DateClickArg) => {
    const clickedDate = info.date;
    calendarRef.current?.getApi().changeView("timeGridWeek", clickedDate);
  };

  const handleDatesSet = (dateInfo: DatesSetArg) => {
    const start = dateInfo.start.toISOString() ?? null;
    const end = dateInfo.end.toISOString() ?? null;

    const calendarApi = calendarRef.current?.getApi();
    const currentView = calendarApi?.view.type;

    if (currentView == "dayGridMonth") return;

    setCurrentRange({
      start: start,
      end: end,
    });
  }

  /* Other methods */

  const closeCreateReservationDialog = () => {
    setEventStart(null);
    setEventEnd(null);
  };

  return (
    <>
      <div className="flex justify-start">
        <Link to={"/"}>
          <Button variant="outline" size="icon" className="mr-5">
            <Undo2/>
          </Button>
        </Link>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("reservations.altName")}
        </h3>
      </div>

      <CreateReservationModal
        resourceGroupId={resourceGroupId!}
        start={eventStart!}
        end={eventEnd!}
        resetSelection={closeCreateReservationDialog}
      />

      {clickedInterval && <MaintenanceIntervalModal intervalId={clickedInterval} />}

      <EventCalendar
        calendarRef={calendarRef}
        loading={resourcesLoading || intervalsLoading || reservationsLoading}
        toolbar={headerToolbar}
        initialView={"timeGridWeek"}
        select={handleSelect}
        allowSelect={handleAllowSelect}
        eventClick={handleEventClick}
        eventAllow={handleEventAllow}
        dateClick={handleDateClick}
        datesSet={handleDatesSet}
        events={events}
        initialDate={currentRange.start ? new Date(currentRange.start) : new Date()}
      />
    </>
  );
};

export default ReservationCalendar;