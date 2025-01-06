import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateMaintenanceIntervalDto,
  MaintenanceIntervalControllerApi,
} from "@/api";
import { keys } from "@/data/keys";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useCreateMaintenanceInterval = (
  clusterId: string | undefined
) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: [ "createMaintenanceInterval" ],
    mutationFn: async (createDto: CreateMaintenanceIntervalDto) => {
      const controller = new MaintenanceIntervalControllerApi();
      let response;

      if (clusterId != undefined)
        response = await controller.createNewClusterMaintenanceInterval(
          clusterId, createDto, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      else
        response = await controller.createNewSystemMaintenanceInterval(
            createDto, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.MAINTENANCE_INTERVALS, clusterId] });
      toast.success(t("maintenanceIntervals.createMaintenanceInterval.success"));
    },
    onError: () => {
      toast.error(t("maintenanceIntervals.createMaintenanceInterval.error"));
    },
  });

  return {
    createMaintenanceInterval: mutate,
    createMaintenanceIntervalAsync: mutateAsync,
  };
};
