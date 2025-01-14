import { ReservationDetailsDto } from "@/api";
import { useTranslation } from "react-i18next";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button} from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useFinishReservation } from "@/data/reservation/useFinishReservation";
import { useTeam } from "@/data/team/useTeam";
import { jwtDecode } from "jwt-decode";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";

type ReservationDetailsProps = {
  reservation: ReservationDetailsDto,
}

const ReservationInfo: React.FC<ReservationDetailsProps> = ({
  reservation
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [ authorized, setAuthorized ] = useState<boolean>(false);
  const { team, isLoading } = useTeam(reservation.team?.id ? reservation.team.id : '');

  const { finishReservationAsync } = useFinishReservation();

  const handleReservationFinish = async () => {
    if (reservation.id !== undefined) {
      await finishReservationAsync(reservation.id);
      navigate(-1);
    }
  };

  useEffect(() => {
    const checkAuthorization = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate(-1);
        return;
      }

      const decoded = jwtDecode<{ sub: string }>(token);
      const userId = decoded.sub;

      if (!isLoading && team) {
        if (team.users?.some(user => user.id === userId)) {
          setAuthorized(true);
        }
      }
    };

    checkAuthorization();
  }, [team, isLoading, navigate]);

  return (
    <>
      <CardContent className="flex flex-col items-center space-y-4 p-6 w-3/4 mx-auto">
        {[
          {
            label: t("reservations.details.general.id"),
            value: reservation.id
          },
          {
            label: t("reservations.details.general.rgId"),
            link: {
              label: t("reservations.details.general.rgButton"),
              path: `/rg/${reservation.resourceGroup?.id}`,
            },
          },
          {
            label: t("reservations.details.general.rgName"),
            value: reservation.resourceGroup?.name
          },
          {
            label: t("reservations.details.general.rgState"),
            value: reservation.resourceGroup?.stateless ? t("reservations.table.stateless") : t("reservations.table.stateful"),
          },
          {
            label: t("reservations.details.general.teamId"),
            link: {
              label: t("reservations.details.general.teamButton"),
              path: `/teams/${reservation.team?.id}`,
            },
          },
          {
            label: t("reservations.details.general.teamName"),
            value: reservation.team?.name
          },
          {
            label: t("reservations.details.general.start"),
            popOver: {
              content: t("reservations.details.general.startInfo")
            },
            value: new Date(reservation.start + 'Z').toLocaleString()
          },
          {
            label: t("reservations.details.general.end"),
            popOver: {
              content: t("reservations.details.general.endInfo")
            },
            value: new Date(reservation.end + 'Z').toLocaleString()
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
                      {t(field.popOver.content, { delayTime: 0 })}
                    </p>
                  </PopoverContent>
                </Popover>
              )}
              <Label>{field.label}</Label>
            </div>
            {(field.link && authorized) ?
              <Button onClick={() => (navigate(field.link.path))}>
                {/* @ts-expect-error this doesn't impact the page */}
                {t(field.link.label)}
              </Button> :
              <Input className="w-2/3" value={field.value || ""} disabled/>
            }
          </div>
        ))}
      </CardContent>

      {authorized && new Date(reservation.end + 'Z') > new Date() &&
        <div className={"flex items-center justify-center"}>
          <Button
              variant="destructive"
              onClick={() => handleReservationFinish()}
          >
            {new Date(reservation.start + 'Z') > new Date() ?
                t("reservations.details.general.removeReservation") :
                t("reservations.details.general.finishReservation")
            }
          </Button>
        </div>
      }
    </>
  );
};

export default ReservationInfo;