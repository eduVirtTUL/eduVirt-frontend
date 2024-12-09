import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {DateClickArg} from "@fullcalendar/interaction";
import {useDialog} from "@/stores/dialogStore.ts";
import React, {useEffect, useRef, useState} from "react";
import {DateSelectArg, DateSpanApi, EventClickArg, EventInput, ToolbarInput} from "@fullcalendar/core";
import CreateMaintenanceIntervalModal from "@/pages/Maintenance/CreateMaintenanceIntervalModal.tsx";
import {useParams} from "react-router";
import {useMaintenanceIntervals} from "@/data/maintenance/useMaintenanceIntervals.ts";
import {LoaderIcon} from "lucide-react";
import {useTheme} from "@/components/ThemeProvider.tsx";

const headerToolbar: ToolbarInput = {
    center: 'title',
    left: 'prev,next',
    right: 'timeGridWeek,dayGridMonth,today'
}

const MaintenanceCalendar: React.FC = () => {
    const { id } = useParams();
    const {open} = useDialog();

    const calendarRef = useRef(null);

    const [events, setEvents] = useState<EventInput[]>([]);
    const [eventStart, setEventStart] = useState<Date | null>(null);
    const [eventEnd, setEventEnd] = useState<Date | null>(null);

    const { intervals, isLoading } = useMaintenanceIntervals(id, true);

    const {theme} = useTheme();

    const actualTheme =
        theme === "system"
            ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
            : theme;

    useEffect(() => {
        if (!isLoading && intervals) {
            const processedEvents = intervals.items?.map(interval => ({
                id: interval.id,
                title: interval.type == 'SYSTEM' ? 'System maintenance interval' : 'Cluster maintenance interval',
                start: new Date(interval.beginAt! + "Z"),
                end: new Date(interval.endAt! + "Z"),
                color: interval.type == 'SYSTEM' ? '#2A9D8F' : '#E63946',
            }));
            setEvents(processedEvents);
        }
    }, [intervals, isLoading]);

    const handleSelect = (arg: DateSelectArg) => {
        const calendarApi = calendarRef.current.getApi()
        const {start, end} = arg;

        const currentDate = new Date();
        if (start < currentDate || end < currentDate) return;

        calendarApi.unselect();
        setEventStart(start);
        setEventEnd(end);
        open("createInterval");
    };

    const allowSelect = (arg: DateSpanApi) => {
        const {start, end} = arg;
        const currentDate = new Date();
        return !(start < currentDate || end < currentDate);

    }

    const handleEventAllow = (arg: DateSpanApi) => {
        const {start} = arg;
        const currentDate = new Date();
        return !(start < currentDate);
    }

    const handleEventClick = (arg: EventClickArg) => {
        console.log(`Event clicked: ${arg.event.id}`)
    }

    const handleDateClick = (info: DateClickArg) => {
        const clickedDate = info.date;
        calendarRef.current.getApi().changeView("timeGridWeek", clickedDate);
    }

    const closeCreateReservationDialog = () => {
        setEventStart(null);
        setEventEnd(null);
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen my-auto">
                <LoaderIcon className="animate-spin size-10"/>
            </div>
        )
    }

    return (
        <>
            <CreateMaintenanceIntervalModal
                clusterId={id}
                start={eventStart!}
                end={eventEnd!}
                resetSelection={closeCreateReservationDialog}
            />
            <div data-theme={actualTheme} className="flex flex-col my-auto">
                <FullCalendar
                    ref={calendarRef}
                    plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                    headerToolbar={headerToolbar}
                    initialView="timeGridWeek"
                    allDaySlot={false}
                    slotDuration={'00:30:00'}
                    slotLabelFormat={{hour: "2-digit", minute: "2-digit", hour12: false}}
                    eventTimeFormat={{hour: "2-digit", minute: "2-digit", hour12: false}}
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
}

export default MaintenanceCalendar;