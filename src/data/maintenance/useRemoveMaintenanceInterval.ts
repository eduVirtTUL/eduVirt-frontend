import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MaintenanceIntervalControllerApi } from "@/api";
import { keys } from "@/data/keys";
import { toast } from "sonner";
import {useTranslation} from "react-i18next";

export const useRemoveMaintenanceInterval = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: ["removeMaintenanceInterval"],
    mutationFn: async (maintenanceIntervalId: string) => {
      const controller = new MaintenanceIntervalControllerApi();
      const response = await controller.finishMaintenanceInterval(
        maintenanceIntervalId
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.MAINTENANCE_INTERVALS] });
      toast.success(t("maintenanceIntervals.removeMaintenanceInterval.success"));
    },
    onError: () => {
      toast.error(t("maintenanceIntervals.removeMaintenanceInterval.error"));
    },
  });

  return {
    removeMaintenanceInterval: mutate,
    removeMaintenanceIntervalAsync: mutateAsync,
  };
};
