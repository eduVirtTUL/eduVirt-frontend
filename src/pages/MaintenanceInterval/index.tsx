import { useTranslation } from "react-i18next";
import React from "react";
import { useMaintenanceInterval } from "@/data/maintenance/useMaintenanceInterval";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useDialog } from "@/stores/dialogStore";
import { Button } from "@/components/ui/button";
import { useRemoveMaintenanceInterval } from "@/data/maintenance/useRemoveMaintenanceInterval";

type MaintenanceIntervalModal = {
    intervalId: string;
}

const MaintenanceIntervalDetailsModal: React.FC<MaintenanceIntervalModal> = ({ intervalId }) => {
  const { t } = useTranslation();
  const { isOpen, close } = useDialog();
  const { interval } = useMaintenanceInterval(intervalId);
  const { removeMaintenanceIntervalAsync } = useRemoveMaintenanceInterval();

  const handleDelete = async () => {
    await removeMaintenanceIntervalAsync(intervalId);
    close();
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
          <DialogTitle>
            {interval?.type == 'CLUSTER' ? t("maintenanceIntervals.details.title.cluster") : t("maintenanceIntervals.details.title.system")}
          </DialogTitle>

          {[
            {label: t("maintenanceIntervals.details.id"), value: interval?.id},
            {label: t("maintenanceIntervals.details.cause"), value: interval?.cause},
            {label: t("maintenanceIntervals.details.description"), value: interval?.description},
            {label: t("maintenanceIntervals.details.type"), value: interval?.type},
            {label: t("maintenanceIntervals.details.clusterId"), value: interval?.clusterId},
            {label: t("maintenanceIntervals.details.beginAt"), value: interval?.beginAt ? new Date(interval?.beginAt + 'Z').toLocaleString() : ''},
            {label: t("maintenanceIntervals.details.endAt"), value: interval?.endAt ? new Date(interval?.endAt + 'Z').toLocaleString() : ''},
          ].map((field, index) => (
            <div key={index} className="flex items-center w-full">
              <Label className="w-48 text-left mr-4">{field.label}</Label>
              <Input className="flex-1" value={field.value || ""} disabled/>
            </div>
          ))}

          {new Date(interval?.endAt + 'Z') > new Date() ?
            <div className={"grid grid-cols-2 space-x-4"}>
              <Button variant="destructive" onClick={handleDelete}>
                {new Date(interval?.beginAt + 'Z') > new Date() ?
                  t("maintenanceIntervals.details.actions.delete.name") :
                  t("maintenanceIntervals.details.actions.finish.name")}
              </Button>

              <Button onClick={() => { close() }}>
                {t("maintenanceIntervals.details.actions.cancel")}
              </Button>
            </div> :
            <div className={"grid grid-cols-1"}>
              <Button onClick={() => { close() }}>
                {t("maintenanceIntervals.details.actions.cancel")}
              </Button>
            </div>}
      </DialogContent>
    </Dialog>
</>
  );
};

export default MaintenanceIntervalDetailsModal;