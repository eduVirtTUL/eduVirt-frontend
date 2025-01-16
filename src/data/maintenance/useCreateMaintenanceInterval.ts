import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateMaintenanceIntervalDto } from "@/api";
import { keys } from "@/data/keys";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { privateAxios } from "@/data/privateAxios";

export const useCreateMaintenanceInterval = (
  clusterId: string | undefined
) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, mutateAsync } = useMutation({
    mutationKey: [ "createMaintenanceInterval" ],
    mutationFn: async (createDto: CreateMaintenanceIntervalDto) => {
      let response;

      if (clusterId != undefined)
        response = await privateAxios.post<void>(
          `/maintenance-intervals/cluster/${clusterId}`, createDto
        );
      else
        response = await privateAxios.post<void>(
          `/maintenance-intervals/system`, createDto
        );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.MAINTENANCE_INTERVALS, clusterId] });
      toast.success(t("maintenanceIntervals.createMaintenanceInterval.success"));
    }
  });

  return {
    createMaintenanceInterval: mutate,
    createMaintenanceIntervalAsync: mutateAsync,
  };
};
