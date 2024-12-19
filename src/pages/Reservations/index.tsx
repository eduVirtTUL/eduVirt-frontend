import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import {
  DateSelectArg,
  DateSpanApi,
  EventClickArg,
  EventInput,
  ToolbarInput,
} from "@fullcalendar/core";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import CreateReservationModal from "@/pages/Reservations/CreateReservationModal";
import { useDialog } from "@/stores/dialogStore";
import { useTheme } from "@/components/ThemeProvider";
import "../../styles/fullcalendar-shadcn.css";

const headerToolbar: ToolbarInput = {
  center: "title",
  left: "prev,next",
  right: "timeGridWeek,dayGridMonth,today",
};

type ReservationDto = {
  id: string;
  teamId: string;
  resourceGroupId: string;
  start: string;
  end: string;
};

type ResourcesAvailabilityDto = {
  time: string;
  available: boolean;
};

const mockReservations: ReservationDto[] = [
  {
    id: "6e7fa86d-e34b-4a7f-b9ba-73f23c6e54d8",
    teamId: "2dfc13ff-f041-4d77-86cf-e7cdc682c277",
    resourceGroupId: "18511765-3e43-49ee-9d02-50c3f0333057",
    start: "2024-12-06T08:00:00",
    end: "2024-12-06T12:00:00",
  },
  {
    id: "4646081b-75ce-4366-85b2-3d9d19c72103",
    teamId: "684fc304-0c07-4b54-bbde-f46a258a80a2",
    resourceGroupId: "765a540f-2434-4a5d-9787-34ed68b6eb77",
    start: "2024-12-06T12:00:00",
    end: "2024-12-06T14:00:00",
  },
  {
    id: "a93645d4-1e03-4dfc-86c7-d0af69babd0d",
    teamId: "5b14175c-0c08-4c2c-9800-3815f9e4a72b",
    resourceGroupId: "bec8b2aa-52c0-4443-be79-3206b66c5038",
    start: "2024-12-06T14:00:00",
    end: "2024-12-06T15:00:00",
  },
];

const mockResourcesAvailability: ResourcesAvailabilityDto[] = [
  {
    time: "2024-12-10T00:00:00",
    available: true,
  },
  {
    time: "2024-12-10T00:30:00",
    available: true,
  },
  {
    time: "2024-12-10T01:00:00",
    available: true,
  },
  {
    time: "2024-12-10T01:30:00",
    available: true,
  },
  {
    time: "2024-12-10T02:00:00",
    available: true,
  },
  {
    time: "2024-12-10T02:30:00",
    available: true,
  },
  {
    time: "2024-12-10T03:00:00",
    available: true,
  },
  {
    time: "2024-12-10T03:30:00",
    available: true,
  },
  {
    time: "2024-12-10T04:00:00",
    available: true,
  },
  {
    time: "2024-12-10T04:30:00",
    available: true,
  },
  {
    time: "2024-12-10T05:00:00",
    available: true,
  },
  {
    time: "2024-12-10T05:30:00",
    available: true,
  },
  {
    time: "2024-12-10T06:00:00",
    available: true,
  },
  {
    time: "2024-12-10T06:30:00",
    available: true,
  },
  {
    time: "2024-12-10T07:00:00",
    available: true,
  },
  {
    time: "2024-12-10T07:30:00",
    available: true,
  },
  {
    time: "2024-12-10T08:00:00",
    available: true,
  },
  {
    time: "2024-12-10T08:30:00",
    available: true,
  },
  {
    time: "2024-12-10T09:00:00",
    available: false,
  },
  {
    time: "2024-12-10T09:30:00",
    available: false,
  },
  {
    time: "2024-12-10T10:00:00",
    available: false,
  },
  {
    time: "2024-12-10T10:30:00",
    available: false,
  },
  {
    time: "2024-12-10T11:00:00",
    available: false,
  },
  {
    time: "2024-12-10T11:30:00",
    available: false,
  },
  {
    time: "2024-12-10T12:00:00",
    available: false,
  },
  {
    time: "2024-12-10T12:30:00",
    available: true,
  },
  {
    time: "2024-12-10T13:00:00",
    available: true,
  },
  {
    time: "2024-12-10T13:30:00",
    available: true,
  },
  {
    time: "2024-12-10T14:00:00",
    available: true,
  },
  {
    time: "2024-12-10T14:30:00",
    available: true,
  },
  {
    time: "2024-12-10T15:00:00",
    available: true,
  },
  {
    time: "2024-12-10T15:30:00",
    available: true,
  },
  {
    time: "2024-12-10T16:00:00",
    available: false,
  },
  {
    time: "2024-12-10T16:30:00",
    available: false,
  },
  {
    time: "2024-12-10T17:00:00",
    available: false,
  },
  {
    time: "2024-12-10T17:30:00",
    available: false,
  },
  {
    time: "2024-12-10T18:00:00",
    available: false,
  },
  {
    time: "2024-12-10T18:30:00",
    available: false,
  },
  {
    time: "2024-12-10T19:00:00",
    available: false,
  },
  {
    time: "2024-12-10T19:30:00",
    available: false,
  },
  {
    time: "2024-12-10T20:00:00",
    available: false,
  },
  {
    time: "2024-12-10T20:30:00",
    available: false,
  },
  {
    time: "2024-12-10T21:00:00",
    available: false,
  },
  {
    time: "2024-12-10T21:30:00",
    available: false,
  },
  {
    time: "2024-12-10T22:00:00",
    available: false,
  },
  {
    time: "2024-12-10T22:30:00",
    available: false,
  },
  {
    time: "2024-12-10T23:00:00",
    available: false,
  },
  {
    time: "2024-12-10T23:30:00",
    available: false,
  },
];

const ReservationCalendar: React.FC = () => {
  const { open } = useDialog();

  const resourceGroupId = uuid();
  const calendarRef = useRef<FullCalendar | null>(null);
  const [events] = useState<EventInput[]>([]);

  const [eventStart, setEventStart] = useState<Date | null>(null);
  const [eventEnd, setEventEnd] = useState<Date | null>(null);

  const { theme } = useTheme();

  const actualTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  useEffect(() => {
    mockReservations.forEach((reservation) => {
      events.push({
        start: reservation.start,
        end: reservation.end,
        title: `Reservation ${reservation.id}`,
        id: reservation.id,
      });
    });

    mockResourcesAvailability.forEach((availability) => {
      const startTime = new Date(availability.time);
      const timeVar = new Date(startTime);
      const endTime = new Date(timeVar.setMinutes(timeVar.getMinutes() + 30));

      events.push({
        start: startTime,
        end: endTime,
        overlap: availability.available,
        selectable: availability.available,
        display: "background",
        color: availability.available ? "lightgreen" : "red",
        disabled: true,
      });
    });
  }, []);

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

  const allowSelect = (arg: DateSpanApi) => {
    const { start, end } = arg;

    const calendarApi = calendarRef.current?.getApi();
    const currentView = calendarApi?.view.type;

    if (currentView == "dayGridMonth") return true;

    const currentDate = new Date();
    if (start < currentDate || end < currentDate) return false;

    const overlappingBackgroundEvents: EventInput[] = events.filter(
      (event) =>
        event.end! > start && event.start! < end && event.selectable !== null
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
    console.log(`Event clicked: ${arg.event.id}`);
  };

  const handleDateClick = (info: DateClickArg) => {
    const clickedDate = info.date;
    calendarRef.current?.getApi().changeView("timeGridWeek", clickedDate);
  };

  const closeCreateReservationDialog = () => {
    setEventStart(null);
    setEventEnd(null);
  };

  return (
    <>
      <CreateReservationModal
        resourceGroupId={resourceGroupId}
        start={eventStart!}
        end={eventEnd!}
        resetSelection={closeCreateReservationDialog}
      />
      <div data-theme={actualTheme} className={`flex flex-col my-auto`}>
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
          headerToolbar={headerToolbar}
          initialView="timeGridWeek"
          allDaySlot={false}
          slotDuration={"00:30:00"}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          eventDisplay={"block"}
          firstDay={1}
          height={"90vh"}
          events={events}
          selectable={true}
          select={handleSelect}
          selectAllow={allowSelect}
          editable={false}
          eventClick={handleEventClick}
          eventDurationEditable={false}
          eventAllow={handleEventAllow}
          dateClick={handleDateClick}
        />
      </div>
    </>
  );
};

export default ReservationCalendar;
