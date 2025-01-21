import { ReservationDetailsDto } from "@/api";
import { useTranslation } from "react-i18next";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";
import { useReservationTimeframeModifiers } from "@/data/reservation/useReservationTimeframeModifiers";
import { Skeleton } from "@/components/ui/skeleton";
import i18next from "i18next";

type ReservationDetailsProps = {
  reservation: ReservationDetailsDto | undefined,
}

const ReservationInfo: React.FC<ReservationDetailsProps> = ({
  reservation
}) => {
  const { t } = useTranslation();

  const { modifiers, isLoading: isLoadingModifiers } = useReservationTimeframeModifiers();

  if (reservation === undefined) {
    return (
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
    );
  }

  return (
    <>
      <CardContent className="flex flex-col items-center space-y-4 p-6 w-3/4 mx-auto">
        {[
          {
            label: t("reservations.details.general.id"),
            value: reservation.id
          },
          {
            label: t("reservations.details.general.rgName"),
            value: reservation.resourceGroup?.name
          },
          {
            label: t("reservations.details.general.rgId"),
            value: reservation.resourceGroup?.id,
          },
          {
            label: t("reservations.details.general.rgState"),
            value: reservation.resourceGroup?.stateless ? t("reservations.table.stateless") : t("reservations.table.stateful"),
          },
          {
            label: t("reservations.details.general.teamId"),
            value: reservation.team?.id,
          },
          {
            label: t("reservations.details.general.teamName"),
            value: reservation.team?.name
          },
          {
            label: t("reservations.details.general.start"),
            // popOver: {
            //   content: t("reservations.details.general.startInfo")
            // },
            value: new Date(reservation.start + 'Z').toLocaleString(i18next.language)
          },
          {
            label: t("reservations.details.general.end"),
            popOver: {
              content: t("reservations.details.general.endInfo")
            },
            value: new Date(reservation.end + 'Z').toLocaleString(i18next.language)
          },
        ].map((field, index) => (
          <div key={index} className="flex w-full items-center space-x-4">
            <div className="flex w-1/3 items-center space-x-2 text-left">
              {field.popOver && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                  </PopoverTrigger>
                  <PopoverContent side="left" className="w-80">
                    <p className="text-sm">
                      {/* @ts-expect-error this doesn't impact the page */}
                      {isLoadingModifiers ? "" : t(field.popOver.content, { delayTime: modifiers.endTimeHastening })}
                    </p>
                  </PopoverContent>
                </Popover>
              )}
              <Label>{field.label}</Label>
            </div>
            <Input className="w-1/2" value={field.value || ""} disabled/>
          </div>
        ))}
      </CardContent>
    </>
  );
};

export default ReservationInfo;