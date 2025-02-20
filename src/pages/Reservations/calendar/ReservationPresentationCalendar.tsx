import EventCalendar from "@/components/EventCalendar";
import MaintenanceIntervalModal from "@/components/Modals/MaintenanceIntervalModal";
import { useNavigate } from "react-router";
import FullCalendar from "@fullcalendar/react";
import "../../../styles/fullcalendar-shadcn.css";
import React, { useEffect, useState } from "react";
import {
    AllowFunc,
    DateSelectArg,
    DatesSetArg,
    EventClickArg,
    EventInput,
    ToolbarInput
} from "@fullcalendar/core";
import { MaintenanceIntervalDto, ReservationDto, ResourcesAvailabilityDto } from "@/api";
import { DateClickArg } from "@fullcalendar/interaction";
import { useDialog } from "@/stores/dialogStore";
import {useTranslation} from "react-i18next";

const headerToolbar: ToolbarInput = {
  center: "title",
  left: "prev,next",
  right: "timeGridWeek,dayGridMonth,today",
};

type TimeRange = {
  start: string | null,
  end: string | null,
}

type ReservationPresentationCalendarProps = {
  calendarRef:  React.MutableRefObject<FullCalendar | null>,
  currentRange: TimeRange,
  setCurrentRange: React.Dispatch<React.SetStateAction<TimeRange>>,

  window: number,
  windowLoading: boolean,

  select: ((arg: DateSelectArg) => void) | undefined,
  allowSelect: AllowFunc | undefined,
  allowEvent: AllowFunc | undefined,

  resources: ResourcesAvailabilityDto[] | undefined,
  resourcesLoading: boolean,
  reservations: ReservationDto[] | undefined,
  reservationsLoading: boolean,
  intervals: MaintenanceIntervalDto[] | undefined,
  intervalsLoading: boolean,
}

const ReservationPresentationCalendar: React.FC<ReservationPresentationCalendarProps> = ({
  calendarRef, currentRange, setCurrentRange,
  select, allowSelect, window, windowLoading, allowEvent, resources, resourcesLoading,
  reservations, reservationsLoading, intervals, intervalsLoading
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { open } = useDialog();

  const [ events, setEvents ] = useState<EventInput[]>([]);

  const [ clickedInterval, setClickedInterval ] = useState<string | null>(null);

  useEffect(() => {
    if (!currentRange.start || !currentRange.end) return;
    if (resourcesLoading || intervalsLoading || reservationsLoading) return;

    const newEvents: EventInput[] = [];
    resources?.forEach((resource: ResourcesAvailabilityDto) => {
      const resourceTime = resource.time! + 'Z';
      const startTime = new Date(resourceTime);
      const timeVar = new Date(resourceTime);
      const endTime = new Date(timeVar.setMinutes(timeVar.getMinutes() + window));

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
        title: interval.type === "SYSTEM" ? t("reservations.calendar.system") : t("reservations.calendar.cluster"),
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
        title: `${t("reservations.calendar.team")} ${reservation.team?.name}`,
        id: reservation.id,
      });
    });

    setEvents(newEvents);
  }, [currentRange, reservations, resources, intervals, window, windowLoading]);

  /* Calendar methods */

  const handleEventClick = (arg: EventClickArg) => {
    if (arg.event.groupId === 'MAINTENANCE_INTERVAL') {
      setClickedInterval(arg.event.id);
      open("showMaintenanceInterval");
    }
    else if (arg.event.groupId === 'RESERVATION') {
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

  return (
    <>
      {clickedInterval && <MaintenanceIntervalModal intervalId={clickedInterval} />}

      <EventCalendar
        timeWindow={window}
        calendarRef={calendarRef}
        loading={resourcesLoading || intervalsLoading || reservationsLoading || windowLoading}
        toolbar={headerToolbar}
        initialView={"timeGridWeek"}
        select={select}
        allowSelect={allowSelect}
        eventClick={handleEventClick}
        eventAllow={allowEvent}
        dateClick={handleDateClick}
        datesSet={handleDatesSet}
        events={events}
        initialDate={currentRange.start ? new Date(currentRange.start) : new Date()}
      />
    </>
  );
}

export default ReservationPresentationCalendar;