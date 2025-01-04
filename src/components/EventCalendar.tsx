import React, {LegacyRef} from "react";
import FullCalendar from "@fullcalendar/react";
import i18next from "i18next";
import plLocale from "@fullcalendar/core/locales/pl";
import enLocale from "@fullcalendar/core/locales/en-gb";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {DateClickArg} from "@fullcalendar/interaction";
import { LoaderIcon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import {
    AllowFunc,
    DateSelectArg,
    DatesSetArg,
    EventClickArg,
    EventInput,
    ToolbarInput
} from "@fullcalendar/core";

type CalendarProps = {
    calendarRef: LegacyRef<FullCalendar> | undefined;
    loading: boolean;
    toolbar: ToolbarInput;
    initialView: string;
    select: ((arg: DateSelectArg) => void) | undefined;
    allowSelect: AllowFunc | undefined;
    eventClick: ((arg: EventClickArg) => void) | undefined;
    eventAllow: AllowFunc | undefined;
    dateClick: ((arg: DateClickArg) => void) | undefined;
    datesSet: ((arg: DatesSetArg) => void) | undefined;

    events: EventInput[];
    initialDate: Date;
}

const EventCalendar: React.FC<CalendarProps> = ({
    calendarRef, loading, toolbar, initialView, select, allowSelect, eventClick,
    eventAllow, dateClick, datesSet, events, initialDate
}) => {
  const {theme} = useTheme();

  const actualTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  const languageSetting = i18next.language == 'pl' ? plLocale : enLocale;

  return (
    <div data-theme={actualTheme} className={`flex flex-col my-auto relative`}>
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        locale={languageSetting}
        headerToolbar={toolbar}
        initialView={initialView}
        initialDate={initialDate}
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
        height={"85vh"}
        events={events}
        selectable={true}
        select={select}
        selectAllow={allowSelect}
        editable={false}
        eventClick={eventClick}
        eventDurationEditable={false}
        eventAllow={eventAllow}
        dateClick={dateClick}
        datesSet={datesSet}
      />

      {loading && (
        <div className="absolute inset-0 flex justify-center items-center z-10 bg-opacity-30 bg-gray-800">
          <LoaderIcon className="animate-spin size-10"/>
        </div>
      )}
    </div>
  );
}

export default EventCalendar;