import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import React from "react";
import { useReservation } from "@/data/reservation/useReservation";
import { Route } from "../../../.react-router/types/src/pages/Reservations/+types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VmList from "@/pages/Reservation/VmList";
import ReservationInfo from "@/pages/Reservation/ReservationInfo";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import ResourceGroupDetails from "@/pages/Reservation/ResourceGroupDetails";
import { RouteHandle } from "@/AuthGuard";
import i18next from "i18next";

const ReservationPage: React.FC<Route.ComponentProps> = ({
  params: { id }
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { reservation } = useReservation({id: id!});

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

      <Tabs defaultValue="general" className={"pt-4 pb-4"}>
        <TabsList className={"grid w-full grid-cols-3"}>
          <TabsTrigger value="general">{t("reservations.details.tabs.general")}</TabsTrigger>
          <TabsTrigger value="rg">{t("reservations.details.tabs.rg")}</TabsTrigger>
          <TabsTrigger value="events">{t("reservations.details.tabs.events")}</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          {reservation ? (
              <ReservationInfo reservation={reservation} />
          ) : (
            <>
              <CardContent className="flex flex-col items-center space-y-4 p-6 w-3/4 mx-auto">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className="flex w-full items-center space-x-4">
                    <Label className="w-1/3 text-left">
                      <Skeleton className="h-5 w-24" />
                    </Label>
                    <Skeleton className="h-10 w-1/2" />
                  </div>
                ))}
              </CardContent>
            </>
          )}
        </TabsContent>
        <TabsContent value="rg">
          {reservation?.resourceGroup?.id && <ResourceGroupDetails id={reservation.resourceGroup.id}/>}
        </TabsContent>
        <TabsContent value="events">
          {reservation?.resourceGroup?.id && <VmList id={reservation.resourceGroup.id}/>}
        </TabsContent>
      </Tabs>
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