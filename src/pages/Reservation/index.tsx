import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useReservation } from "@/data/reservation/useReservation";
import { Route } from "../../../.react-router/types/src/pages/Reservations/+types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VmList from "@/pages/Reservation/VmList";
import ReservationInfo from "@/pages/Reservation/ReservationInfo";
import ResourceGroupDetails from "@/pages/Reservation/ResourceGroupDetails";
import { RouteHandle } from "@/AuthGuard";
import i18next from "i18next";
import {useUser} from "@/stores/userStore";
import ReservationSimplifiedInfo from "@/pages/Reservation/ReservationSimplifiedInfo";

const ReservationPage: React.FC<Route.ComponentProps> = ({
  params: { id }
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const user = useUser();
  const [ authorized, setAuthorized ] = useState<boolean>(false);

  const { reservation, isLoading } = useReservation({id: id!});

  useEffect(() => {
    if (!isLoading && reservation) {
      if ((user.activeRole === "student" && reservation.team?.users?.some(userDto => userDto.id === user.id)) ||
          user.activeRole === "teacher" || user.activeRole === "administrator") {
        setAuthorized(true);
      }
    }
  }, [reservation, isLoading, navigate]);

  return (
    <>
      <div className={"flex justify-start"}>
        <Button onClick={() => (navigate(-1))} variant="outline" size="icon" className="mr-5">
          <Undo2/>
        </Button>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("reservations.details.title") + id}
        </h3>
      </div>

      {authorized ?
        <Tabs defaultValue="general" className={"pt-4 pb-4"}>
          <TabsList className={"grid w-full grid-cols-3"}>
            <TabsTrigger value="general">{t("reservations.details.tabs.general")}</TabsTrigger>
            <TabsTrigger value="rg">{t("reservations.details.tabs.rg")}</TabsTrigger>
            <TabsTrigger value="events">{t("reservations.details.tabs.events")}</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <ReservationInfo reservation={reservation} />
          </TabsContent>
          <TabsContent value="rg">
            {reservation?.resourceGroup?.id && <ResourceGroupDetails id={reservation.resourceGroup.id}/>}
          </TabsContent>
          <TabsContent value="events">
            {reservation?.resourceGroup?.id && <VmList id={reservation.resourceGroup.id}/>}
          </TabsContent>
        </Tabs> :
        <ReservationSimplifiedInfo reservation={reservation} />
      }
    </>
  );
}

export default ReservationPage;

export const handle: RouteHandle = {
  roles: ["student", "teacher", "administrator"],
};

export const meta = () => {
  return [{ title: i18next.t("pageTitles.maintenanceCalendar") }];
};