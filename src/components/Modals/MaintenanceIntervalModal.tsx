import { useTranslation } from "react-i18next";
import React from "react";
import { useMaintenanceInterval } from "@/data/maintenance/useMaintenanceInterval";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useDialog } from "@/stores/dialogStore";
import { Button } from "@/components/ui/button";
import { CheckIcon, TrashIcon, XCircleIcon } from "lucide-react";
import { useUser } from "@/stores/userStore";
import { useRemoveMaintenanceInterval } from "@/data/maintenance/useRemoveMaintenanceInterval";
import i18next from "i18next";

type MaintenanceIntervalModal = {
    intervalId: string;
}

const MaintenanceIntervalModal: React.FC<MaintenanceIntervalModal> = ({ intervalId }) => {
  const { t } = useTranslation();
  const { isOpen, close } = useDialog();
  const { interval } = useMaintenanceInterval(intervalId);
  const { removeMaintenanceIntervalAsync } = useRemoveMaintenanceInterval();

  const user = useUser();

  const handleDelete = async () => {
    close();
    await removeMaintenanceIntervalAsync(intervalId);
  };

  return (
    <>
      <Dialog
        open={isOpen("showMaintenanceInterval")}
        onOpenChange={() => {
          close();
        }}
      >

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {interval?.type == 'CLUSTER' ? t("maintenanceIntervals.details.title.cluster") : t("maintenanceIntervals.details.title.system")}
            </DialogTitle>
          </DialogHeader>

          {[
            {label: t("maintenanceIntervals.details.id"), value: interval?.id},
            {label: t("maintenanceIntervals.details.cause"), value: interval?.cause},
            {label: t("maintenanceIntervals.details.description"), value: interval?.description},
            {label: t("maintenanceIntervals.details.type"), value: interval?.type},
            {label: t("maintenanceIntervals.details.clusterId"), value: interval?.clusterId},
            {label: t("maintenanceIntervals.details.beginAt"), value: interval?.beginAt ? new Date(interval?.beginAt + 'Z').toLocaleString(i18next.language) : ''},
            {label: t("maintenanceIntervals.details.endAt"), value: interval?.endAt ? new Date(interval?.endAt + 'Z').toLocaleString(i18next.language) : ''},
          ].map((field, index) => (
            <div key={index} className="flex items-center w-full">
              <Label className="w-48 text-left mr-4">{field.label}</Label>
              <Input className="flex-1" value={field.value || ""} disabled/>
            </div>
          ))}

          <DialogFooter className={"grid grid-cols-1"}>
            {user.activeRole === 'administrator' ? (
              <div className="flex flex-row justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => { close() }}
                >
                  <XCircleIcon/>
                  {t("cancel")}
                </Button>

                {(new Date(interval?.beginAt + 'Z') < new Date() && new Date() < new Date(interval?.endAt + 'Z')) ? (
                  <Button
                    type="submit"
                    disabled={new Date(interval?.endAt + 'Z') < new Date()}
                    onClick={() => handleDelete()}
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    {t("maintenanceIntervals.details.actions.finish.name")}
                </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={new Date(interval?.endAt + 'Z') < new Date()}
                    onClick={() => handleDelete()}
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    {t("maintenanceIntervals.details.actions.delete.name")}
                </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-row justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => { close() }}
                >
                  <XCircleIcon/>
                  {t("cancel")}
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MaintenanceIntervalModal;