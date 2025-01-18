import FullCalendar from "@fullcalendar/react";
import { DateClickArg } from "@fullcalendar/interaction";
import { useDialog } from "@/stores/dialogStore";
import React, { useEffect, useRef, useState } from "react";
import {
  DateSelectArg,
  DateSpanApi, DatesSetArg,
  EventClickArg,
  EventInput,
  ToolbarInput,
} from "@fullcalendar/core";
import CreateMaintenanceIntervalModal from "@/components/Modals/CreateMaintenanceIntervalModal";
import { useNavigate, useParams } from "react-router";
import { useMaintenanceIntervalsInTimePeriod } from "@/data/maintenance/useMaintenanceIntervalsInTimePeriod";
import "../../styles/fullcalendar-shadcn.css";
import EventCalendar from "@/components/EventCalendar";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {RouteHandle} from "@/AuthGuard";
import i18next from "i18next";
import MaintenanceIntervalModal from "@/components/Modals/MaintenanceIntervalModal";

const headerToolbar: ToolbarInput = {
  center: "title",
  left: "prev,next",
  right: "timeGridWeek,dayGridMonth,today",
};

type TimeRange = {
  start: string | null,
  end: string | null,
}

const MaintenanceCalendar: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { open } = useDialog();
  const navigate = useNavigate();

  const calendarRef = useRef<FullCalendar | null>(null);

  const [ currentRange, setCurrentRange ] = useState<TimeRange>({start: null, end: null});
  const [ events, setEvents ] = useState<EventInput[]>([]);
  const [ eventStart, setEventStart ] = useState<Date | null>(null);
  const [ eventEnd, setEventEnd ] = useState<Date | null>(null);

  const { intervals, isLoading: intervalsLoading } = useMaintenanceIntervalsInTimePeriod(id, currentRange.start, currentRange.end);

  const [ clickedEvent, setClickedEvent ] = useState<string | null>(null);

  useEffect(() => {
    if (!intervalsLoading && !intervals) navigate(-1);
  }, [navigate, t, intervalsLoading, intervals]);

  useEffect(() => {
    if (!intervalsLoading && intervals) {
      const processedEvents = intervals.map((interval) => ({
        id: interval.id,
        title:
          interval.type == "SYSTEM"
            ? "System maintenance interval"
            : "Cluster maintenance interval",
        start: new Date(interval.beginAt! + "Z"),
        end: new Date(interval.endAt! + "Z"),
        color: interval.type == "SYSTEM" ? "#2A9D8F" : "#E63946",
      }));
      setEvents(processedEvents);
    }
  }, [intervals, intervalsLoading]);

  /* Calendar methods */

  const handleSelect = (arg: DateSelectArg) => {
    const calendarApi = calendarRef.current?.getApi();
    const { start, end } = arg;

    if (calendarApi?.view.type === 'dayGridMonth') return;
    const currentDate = new Date();
    if (start < currentDate || end < currentDate) return;

    calendarApi?.unselect();
    setEventStart(start);
    setEventEnd(end);
    open("createInterval");
  };

  const handleAllowSelect = (arg: DateSpanApi) => {
    const { start, end } = arg;
    const currentDate = new Date();
    return !(start < currentDate || end < currentDate);
  };

  const handleEventAllow = (arg: DateSpanApi) => {
    const { start } = arg;
    const currentDate = new Date();
    return !(start < currentDate);
  };

  const handleEventClick = (arg: EventClickArg) => {
    setClickedEvent(arg.event.id);
    open("showMaintenanceInterval");
  };

  const handleDateClick = (info: DateClickArg) => {
    const clickedDate = info.date;
    calendarRef.current?.getApi().changeView("timeGridWeek", clickedDate);
  };

  const closeCreateReservationDialog = () => {
    setEventStart(null);
    setEventEnd(null);
  };

  const handleDatesSet = (dateInfo: DatesSetArg) => {
    const start = dateInfo.start.toISOString() ?? null;
    const end = dateInfo.end.toISOString() ?? null;

    setCurrentRange({
      start: start,
      end: end,
    });
  };

  /* Other methods */

  return (
    <>
      <div className={"flex flex-row items-center justify-items-center"}>
        <Button
          variant="outline"
          size="icon"
          className="mr-5"
          onClick={() => (navigate(-1))}
        >
          <Undo2/>
        </Button>

        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("maintenanceIntervals.altName")}
        </h3>
      </div>

      <CreateMaintenanceIntervalModal
        clusterId={id}
        start={eventStart!}
        end={eventEnd!}
        resetSelection={closeCreateReservationDialog}
      />

      {clickedEvent && <MaintenanceIntervalModal intervalId={clickedEvent} />}

      <EventCalendar
        timeWindow={30}
        loading={intervalsLoading}
        calendarRef={calendarRef}
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

export default MaintenanceCalendar;

export const handle: RouteHandle = {
  roles: ["administrator"],
};

export const meta = () => {
  return [{ title: i18next.t("pageTitles.maintenanceCalendar") }];
};