import { Route } from "../+types/index";
import React, { useEffect, useState } from "react";
import "../../../styles/fullcalendar-shadcn.css";
import { useLocation, useNavigate } from "react-router";
import { useResourceGroupPoolAvailability } from "@/data/reservation/useResourceGroupPoolAvailability";
import { useResourceGroupPoolReservations } from "@/data/reservation/useResourceGroupPoolReservations";
import ReservationCalendar from "@/pages/Reservations/calendar/ReservationCalendar";
import { RouteHandle } from "@/AuthGuard";
import i18next from "i18next";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type TimeRange = {
  start: string | null,
  end: string | null,
}

const RgPoolReservationCalendar: React.FC<Route.ComponentProps> = ({ params: { id }}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { clusterId, courseId, podId, maxRentTime } = location.state || {};
  const navigate = useNavigate();

  const [ active, setActive ] = useState<boolean>(false);
  const [ currentRange, setCurrentRange ] = useState<TimeRange>({start: null, end: null});
  const { resources, isLoading: resourcesLoading } = useResourceGroupPoolAvailability(courseId!, id!, currentRange.start!, currentRange.end!);

  const {reservations, isLoading: reservationsLoading} = useResourceGroupPoolReservations({
    course: courseId!,
    resourceGroupPool: id!,
    start: currentRange.start,
    end: currentRange.end,
    own: active
  });

  useEffect(() => {
    if ((!reservationsLoading && !reservations) && !(resourcesLoading && !resources)) navigate(-1);
  }, [navigate, resources, resourcesLoading, reservations, reservationsLoading]);

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <div className="flex justify-start">
          <Button variant="outline" onClick={() => (navigate(-1))} size="icon" className="mr-5">
            <Undo2/>
          </Button>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {t("reservations.altName")}
          </h3>
        </div>

        <div className={"flex flex-row space-x-3"}>
          <Switch checked={active} onCheckedChange={setActive}/>
          <div className="space-y-0.5">
            <Label className="text-base">{t("reservations.ownReservations")}</Label>
          </div>
        </div>
      </div>

      <ReservationCalendar
        clusterId={clusterId}
        courseId={courseId}
        podId={podId}
        currentRange={currentRange}
        setCurrentRange={setCurrentRange}
        resources={resources}
        resourcesLoading={resourcesLoading}
        reservations={reservations}
        reservationsLoading={reservationsLoading}
        maxRentTime={maxRentTime}
      />
    </>
  );
};

export default RgPoolReservationCalendar;

export const handle: RouteHandle = {
  roles: ["student"],
};

export const meta = () => {
  return [{ title: i18next.t("pageTitles.reservationCalendar") }];
};